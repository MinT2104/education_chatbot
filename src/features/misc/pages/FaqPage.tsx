import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FaqPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using hardcoded FAQ for better formatting
    setLoading(false);
  }, []);

  // Fallback FAQ data if backend returns null
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "You can create an account by clicking the 'Sign up' button in the top right corner. You'll need to provide your email address and create a password, or you can sign up using your Google account for faster registration."
        },
        {
          q: "Is the service free?",
          a: "We offer a free plan with basic features. For advanced features and higher usage limits, we offer paid subscription plans. You can view our pricing plans by clicking 'See plans and pricing' in the help menu."
        },
        {
          q: "What features are available in the free plan?",
          a: "The free plan includes access to GPT-5, limited file uploads, limited image generation, and basic memory and context features. Check our pricing page for detailed feature comparisons."
        }
      ]
    },
    {
      category: "Account & Subscription",
      questions: [
        {
          q: "How do I upgrade my plan?",
          a: "You can upgrade your plan by navigating to the pricing page through the help menu, or by visiting /pricing. Select your school category (Government or Private) and click 'Upgrade to Go' on the plan you want."
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes, you can cancel your subscription at any time from your account settings or subscription page. Your subscription will remain active until the end of the current billing period."
        },
        {
          q: "What payment methods do you accept?",
          a: "We currently accept payments through PayPal. More payment methods may be added in the future."
        },
        {
          q: "Will I be charged automatically?",
          a: "Yes, subscriptions are billed automatically on a monthly basis. You'll be charged on the same date each month based on when you first subscribed."
        }
      ]
    },
    {
      category: "Features & Usage",
      questions: [
        {
          q: "What is the difference between Government and Private school plans?",
          a: "Government schools have access to unlimited free chats, while Private schools have a limit of 25 free chats. Pricing for the Go plan also differs between the two categories."
        },
        {
          q: "How do I share a conversation?",
          a: "You can share a conversation by clicking the share button in the top bar. This will generate a shareable link that you can copy and send to others."
        },
        {
          q: "Can I export my conversations?",
          a: "Yes, you can export your conversations. Look for the export option in the conversation menu or settings."
        },
        {
          q: "What file types can I upload?",
          a: "Supported file types depend on your plan. Free plan users have limited file upload capabilities, while Go plan users have expanded upload options. Check the feature list on the pricing page for details."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "I'm experiencing technical issues. What should I do?",
          a: "First, try refreshing the page or clearing your browser cache. If the issue persists, contact our support team through the help center or email us directly."
        },
        {
          q: "Is my data secure?",
          a: "Yes, we take data security seriously. We use industry-standard encryption and security measures to protect your information. Please review our Privacy Policy for more details."
        },
        {
          q: "Do you store my conversations?",
          a: "We store your conversations to provide you with conversation history and improve the service. You can delete conversations at any time. For more information, please see our Privacy Policy."
        },
        {
          q: "What browsers are supported?",
          a: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your browser."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "How do you protect my personal information?",
          a: "We implement various security measures including encryption, secure servers, and regular security audits. Your password is hashed and never stored in plain text. See our Privacy Policy for complete details."
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can delete your account at any time from your account settings. This will permanently delete all your data and cannot be undone."
        },
        {
          q: "Do you share my data with third parties?",
          a: "We do not sell your personal data. We only share information as necessary to provide the service, comply with legal obligations, or with your explicit consent. See our Privacy Policy for full details."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-semibold mb-2">
          {loading ? "Loading..." : "Frequently Asked Questions"}
        </h1>
        <p className="text-muted-foreground mb-8">
          Find answers to common questions about our service. If you can't find what you're looking for, please contact our support team.
        </p>

        {/* Using hardcoded FAQ content */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="bg-surface rounded-lg p-5 border border-border">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-surface rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Please contact our support team and we'll be happy to help.
          </p>
          <div className="flex gap-4">
            <Link
              to="/app"
              className="text-primary underline hover:text-primary/80"
            >
              Back to App
            </Link>
            <Link
              to="/terms"
              className="text-primary underline hover:text-primary/80"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-primary underline hover:text-primary/80"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;

