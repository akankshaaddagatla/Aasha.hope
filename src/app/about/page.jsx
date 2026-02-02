"use client"
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-yellow-300">Aasha.Hope</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            आशा means hope in Hindi. We're building a future where every act of kindness creates lasting change.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Aasha.Hope is more than a fundraising platform—it's a movement to transform how people connect with causes they care about. We bridge the gap between compassionate donors and verified NGOs creating real impact.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Through transparency, verification, and community engagement, we ensure every donation creates meaningful change. Our platform empowers NGOs to share their stories, engage supporters, and build sustainable funding.
              </p>
            </div>
            
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                alt="Volunteers helping community"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Aasha.Hope?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border-2 border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Verified</h3>
              <p className="text-gray-700">
                Every NGO is personally verified by our team. We check registrations, leadership, and past work to ensure legitimacy.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border-2 border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Full Transparency</h3>
              <p className="text-gray-700">
                Track your donations, see real updates from NGOs, and witness the impact of your contribution through photos and stories.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-xl border-2 border-pink-200">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-700">
                Follow NGOs, engage with updates, and build meaningful connections with causes you care about—not just transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Aasha.Hope was born from a simple question: <strong>"How can we make charitable giving more transparent, engaging, and impactful?"</strong>
            </p>
            <p className="text-lg leading-relaxed mb-4">
              We saw a disconnect. Donors wanted to help but didn't know which NGOs to trust. NGOs were doing incredible work but struggled to reach supporters and share their impact. Traditional fundraising felt transactional, impersonal, and opaque.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              So we built something different. A platform that combines the engagement of social media with the security of verified charitable giving. NGOs can share updates like Instagram, donors can follow causes like Twitter, and everyone can see exactly where money goes and what impact it creates.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Every NGO on our platform is manually verified. Every campaign is reviewed. Every donation is tracked. We're not just moving money—we're building trust, community, and lasting relationships between people who want to help and organizations creating change.
            </p>
            <p className="text-lg leading-relaxed font-semibold text-blue-600">
              Together, we're proving that hope (आशा) isn't just a feeling—it's action. And every action, no matter how small, can create ripples of change.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of donors and NGOs creating real change together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Explore NGOs and Campaigns
            </Link>
            <Link
              href="/signup"
              className="border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Register Your NGO
            </Link>
            <Link
              href="/createCampaign"
              className="border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}