
import { Link } from "react-router-dom";
import { Instagram, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">CampusRide</span>
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
            © {new Date().getFullYear()} CampusRide. All Rights Reserved.
          </span>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <a href="https://www.instagram.com/the_k.r.v" className="text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4" />
              <span className="ml-1 text-xs">the_k.r.v</span>
            </a>
            <a href="tel:8192036602" className="text-muted-foreground hover:text-primary">
              <Phone className="h-4 w-4" />
              <span className="ml-1 text-xs">8192036602</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
