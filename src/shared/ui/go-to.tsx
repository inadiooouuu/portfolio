import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent, ReactNode } from "react";
import { useLenis } from "lenis/react";
import { cn } from "@/shared/lib/utils";

interface GoToProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export function GoTo({ to, className, children }: GoToProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lenis = useLenis();

  // ponytail: native document.startViewTransition for cross-page route morphing.
  // falls back to standard navigate if browser does not support View Transitions API.
  if (to.startsWith("/")) {
    const handleRouteTransition = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (pathname === to) {
        lenis ? lenis.scrollTo(0, { immediate: false }) : window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if ("startViewTransition" in document) {
        document.startViewTransition(() => {
          navigate(to);
        });
      } else {
        navigate(to);
      }
    };

    return (
      <Link to={to} onClick={handleRouteTransition} className={className}>
        {children}
      </Link>
    );
  }

  const id = to.replace(/^#/, "");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const scrollTo = () => {
      if (lenis) {
        lenis.scrollTo(`#${id}`);
      } else {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (pathname === "/") {
      scrollTo();
      return;
    }

    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        navigate("/");
      });
    } else {
      navigate("/");
    }
    window.setTimeout(scrollTo, 120);
  };

  return (
    <a href={`#${id}`} onClick={handleClick} className={cn(className)}>
      {children}
    </a>
  );
}
