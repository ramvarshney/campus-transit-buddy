
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">CampusTracker</span>
            </Link>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Track your campus bus in real-time and never miss a ride again.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 text-sm font-semibold">Navigation</h3>
              <ul className="text-sm">
                <li className="mb-2">
                  <Link to="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/student" className="hover:text-primary">
                    Student Panel
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/driver" className="hover:text-primary">
                    Driver Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Support</h3>
              <ul className="text-sm">
                <li className="mb-2">
                  <a href="#" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-primary">
                    Contact Us
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CampusTracker. All Rights Reserved.
          </span>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            {/* Social Media Icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
