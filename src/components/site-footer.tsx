import { Link } from "@tanstack/react-router";
import { HardHat } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">
              <HardHat className="size-4" />
            </span>
            <span className="font-display font-bold">SHRAMIK</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Connecting Skills. Creating Opportunities. Nepal's local workforce platform.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">For Employers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/workers" className="hover:text-foreground">Find workers</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Post a job</Link></li>
            <li><Link to="/how-it-works" className="hover:text-foreground">How it works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">For Workers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">Join as a worker</Link></li>
            <li><Link to="/jobs" className="hover:text-foreground">Browse jobs</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Worker dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Payments accepted</h4>
          <p className="mt-3 text-sm text-muted-foreground">eSewa · Khalti · IME Pay · Bank transfer · Cash</p>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SHRAMIK — Every skill deserves opportunity.
      </div>
    </footer>
  );
}
