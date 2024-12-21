import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutSettings() {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">About This Application</h3>
          <p>
                        This dashboard application is designed to help Tausi improve their functionality which includes:- track analytics, and streamline your workflow. Built with the latest technologies, it offers a robust and user-friendly interface for all your management needs.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Version Information</h3>
          <p>Current Version: 1.0.0</p>
          <Button variant="default" className="hover:bg-black hover:text-white dark:text-gray-300">Check for Updates</Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Download the App</h3>
          <div className="flex space-x-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              <img
                src="/googlelogo.svg"
                alt="Google Play Store"
              />
            </a>

            <a
              href="https://apps.apple.com/app/id1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              <img
              src="/applogo.svg"
              alt="App Store"
              />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Credits</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Developed by: Tausi</li>
            <li>UI Components: shadcn/ui</li>
            <li>Icons: Lucide Icons</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Legal</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://tausiapp.com/terms-conditions/" className="text-blue-500 hover:underline">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">License Agreement</a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

