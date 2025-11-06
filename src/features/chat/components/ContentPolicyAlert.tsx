interface ContentPolicyAlertProps {
  show: boolean;
  reason?: string;
  onClose?: () => void;
}

const ContentPolicyAlert = ({
  show,
  reason = "Your request was flagged for potentially violating our content policy.",
  onClose,
}: ContentPolicyAlertProps) => {
  if (!show) return null;

  return (
    <div className="my-4 mx-auto max-w-[900px] px-6">
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <div className="flex-1">
            <h4 className="font-medium text-amber-700 dark:text-amber-400">
              Content Policy Warning
            </h4>
            <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
              {reason}
            </p>
            <a
              href="/content-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-700 dark:text-amber-400 underline hover:no-underline mt-2 inline-block"
            >
              View our content policy →
            </a>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPolicyAlert;

