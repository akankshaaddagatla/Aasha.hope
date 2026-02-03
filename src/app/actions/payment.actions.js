"use server"

import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

//  Create Razorpay Order
export async function createPaymentOrder(formData) {
  const supabase = await createClient()

  // Get user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Please login to donate' }
  }

  const { amount, ngoId, campaignId, donatedBy } = formData

  // Validate campaign before creating order
  if (campaignId) {
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('amount_raising, amount_raised, status')
      .eq('id', campaignId)
      .single()
    
    if (campaignError || !campaign) {
      return { error: 'Campaign not found' }
    }

    const currentRaised = campaign.amount_raised || 0
    const remaining = campaign.amount_raising - currentRaised

    if (remaining <= 0) {
      return { error: 'This campaign has reached its goal' }
    }

    if (amount > remaining) {
      return { 
        error: `This campaign only needs ₹${remaining.toFixed(2)} more to reach its goal. Please donate that amount or less.` 
      }
    }
  }else{
     const { data: ngo, error: ngoError } = await supabase
      .from('ngos')
      .select('amount_raising, amount_raised')
      .eq('id', ngoId)
      .single()
    
    if (ngoError || !ngo) {
      return { error: 'NGO not found' }
    }

    const currentRaised = ngo.amount_raised || 0
    const remaining = ngo.amount_raising - currentRaised

    if (remaining <= 0) {
      return { error: 'This NGO has reached its goal' }
    }

    if (amount > remaining) {
      return { 
        error: `This NGO only needs ₹${remaining.toFixed(2)} more to reach its goal. Please donate that amount or less.` 
      }
    }
  }

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })


    // Create pending donation in database
    const { data: donation, error } = await supabase
      .from('donations')
      .insert({
        donor_id: user.id,
        ngo_id: ngoId || null,
        campaign_id: campaignId || null,
        amount: amount,
        donated_by: donatedBy || 'Anonymous',
        type: 'one-time',
        payment_status: 'processing',
        razorpay_order_id: order.id,
      })
      .select()
      .single()


    if (error) {
      console.log(error)
      return { error: 'Failed to create donation record' }
    }

    return {
      success: true,
      orderId: order.id,
      amount: amount,
      donationId: donation.id,
    }
  } catch (error) {
    console.error('Order creation error:', error)
    return { error: 'Failed to create payment order' }
  }
}

// Verify Payment
export async function verifyPayment(paymentData) {
  const supabase = await createClient()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = paymentData

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  const isValid = expectedSignature === razorpay_signature

  if (!isValid) {
    // Mark as failed
    await supabase
      .from('donations')
      .update({ payment_status: 'verification_failed'})
      .eq('id', donationId)

    return { error: 'Payment verification failed' }
  }

  // Update donation as completed
  const { data: donation, error } = await supabase
    .from('donations')
    .update({
      payment_status: 'successful',
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature,
    })
    .eq('id', donationId)
    .select('ngo_id, campaign_id, amount')
    .single()

  if (error) {
    console.error('Donation update error:', error)
    return { error: 'Failed to update donation' }
  }

  revalidatePath('/users/donor/dashboard')
  return { success: true, donationId }
}
