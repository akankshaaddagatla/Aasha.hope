"use client";

import { useState, useEffect } from "react";
import { createCampaign } from "@/app/actions/campaign.actions";
import { getMyNGO } from "@/app/actions/ngo.actions";
import { getUser } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ngo, setNGO] = useState(null);
  const [isNGOAdmin, setIsNGOAdmin] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    causeStatement: "",
    campaignStory: "",
    coverImageUrl: "",
    logoUrl: "",
    amountRaising: "",
  });

  useEffect(() => {
    async function loadUserAndNGO() {
      // Check if user is logged in
      const { data: currentUser } = await getUser();

      if (!currentUser) {
        setError('Please login to create a campaign');
        router.push("/login");
        return;
      }

      setUser(currentUser);

      // Check if user is NGO admin
      if (currentUser?.role === "ngo") {
        setIsNGOAdmin(true);

        // Try to load their NGO
        const { data: userNGO } = await getMyNGO();

        if (!userNGO) {
          setError('Please register your NGO first');
          router.push("/users/ngo/dashboard/registerNgo");
          return;
        }

        if (userNGO.verification_status != "verified") {
         setError('Your NGO must be verified before creating campaigns');
          router.push("/users/ngo/dashboard");
          return;
        }

        setNGO(userNGO);
      } else {
        // Regular donor - can create independent campaigns
        setIsNGOAdmin(false);
      }

      setPageLoading(false);
    }

    loadUserAndNGO();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await createCampaign({
      ...formData,
      ngoId: isNGOAdmin && ngo ? ngo.id : null, // NGO campaign or independent
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setMessage('Campaign created successfully! Waiting for admin approval.');

      // Redirect based on user type
      if (isNGOAdmin) {
        router.push("/users/ngo/dashboard");
      } else {
        router.push("/users/donor/dashboard");
      }
    }
  };

  // Loading state
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={isNGOAdmin ? "/users/ngo/dashboard" : "/"}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {isNGOAdmin ? "Back to Dashboard" : "Back to Home"}
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            {isNGOAdmin ? "Create New Campaign" : "Start a Campaign"}
          </h1>

          <p className="text-gray-600 mt-2">
            {isNGOAdmin ? (
              <>
                Create a fundraising campaign for <strong>{ngo?.name}</strong>
              </>
            ) : (
              <>
                Have a cause you're passionate about? Start your own fundraising
                campaign!
              </>
            )}
          </p>
        </div>

        {/* Info Box for Donors */}
        {!isNGOAdmin && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
            <div className="flex gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Anyone can start a campaign!
                </h3>
                <p className="text-blue-800 text-sm">
                  You don't need to be an NGO to make a difference. Start a
                  campaign for any cause you care about. Our team will review
                  and verify your campaign before it goes live.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Campaign Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Build 10 Smart Classrooms in Rural Schools"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief overview of the campaign (2-3 sentences)"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
          </div>

          {/* Mission Statement */}
          <div>
            <label
              htmlFor="causeStatement"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mission Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              id="causeStatement"
              name="causeStatement"
              required
              rows={2}
              value={formData.causeStatement}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your mission in a single sentence"
            />
          </div>

          {/* Detailed Campaign Story */}
          <div>
            <label
              htmlFor="campaignStory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Campaign Story <span className="text-red-500">*</span>
            </label>
            <textarea
              id="campaignStory"
              name="campaignStory"
              required
              rows={6}
              value={formData.campaignStory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell the complete story... Why is this campaign important? Who will benefit? What impact will it create?"
            />
            <p className="text-sm text-gray-500 mt-1">
              Be detailed and authentic. Share why this matters.
            </p>
          </div>

          {/* Cover Image URL */}
          <div>
            <label
              htmlFor="coverImageUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImageUrl"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/campaign-image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Add a compelling image (use Unsplash or Imgur for free images)
            </p>
          </div>

          <div>
            <label
              htmlFor="logoUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Logo URL
            </label>
            <input
              type="url"
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/campaign-image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Add a compelling image (use Unsplash or Imgur for free images)
            </p>
          </div>

          {/* Fundraising Goal */}
          <div>
            <label
              htmlFor="amountRaising"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fundraising Goal (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amountRaising"
              name="amountRaising"
              required
              min="1000"
              value={formData.amountRaising}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2500000"
            />
            <p className="text-sm text-gray-500 mt-1">
              How much money do you need to raise? Be realistic.
            </p>
          </div>

          {/* Guidelines (for donors) */}
          {!isNGOAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                📋 Campaign Guidelines:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1 ml-4 list-disc">
                <li>
                  Your campaign will be reviewed by our admin team (24-48 hours)
                </li>
                <li>Be transparent about where the money will go</li>
                <li>Provide proof or documentation during review if needed</li>
                <li>Share regular updates once your campaign is live</li>
                <li>Respond to questions from potential donors</li>
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : isNGOAdmin ? (
                "Create Campaign"
              ) : (
                "Submit for Review"
              )}
            </button>
            <Link
              href={isNGOAdmin ? "/users/ngo/dashboard" : "/"}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>After {isNGOAdmin ? "Approval" : "Review"}:</strong>{" "}
              {isNGOAdmin
                ? "Your campaign will be reviewed by our admin team before going live. This usually takes 24-48 hours."
                : "Once verified, your campaign will be live on Aasha.Hope. You will be able to track donations, share updates, and engage with supporters!"}
            </p>
          </div>

          {/* Campaign Type Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            {isNGOAdmin ? (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                NGO Campaign for {ngo?.name}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Independent Campaign by {user?.name}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
