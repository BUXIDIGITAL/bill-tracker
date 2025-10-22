export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Bill & Subscription Tracker</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A simple, clean web app for tracking recurring bills and subscriptions.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold">🧩 Features (MVP)</h2>
          <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Monthly calendar view with per-day bill counts</li>
            <li>Click a day → see list of bills 💰 with amount and frequency</li>
            <li>Add / edit / delete bills</li>
            <li>Recurrence options: 30 days · Monthly · Quarterly · Annually · Custom interval</li>
            <li>Local storage persistence</li>
            <li>Export / import JSON backup</li>
            <li>Responsive, mobile-friendly design</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold">🛠 Stack</h2>
          <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Next.js (React framework)</li>
            <li>Tailwind CSS for styling</li>
            <li>LocalStorage for data persistence</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold">🚀 Roadmap</h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-700 dark:text-gray-300">
            <li>MVP calendar and bill management</li>
            <li>Smart reminders and totals</li>
            <li>Optional AI assistant for natural-language entry</li>
          </ol>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Ready to start tracking your bills! 🎉</p>
        </div>
      </main>
    </div>
  );
}
