import { useRouter } from "next/router";
import { useAuth } from "./useAuth";
import * as USER from "/lib/user";

export function withAuth(WrappedComponent) {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const router = useRouter();
    const { user } = useAuth();

    if (!user) {
      router.replace("/signup");
      return null;
    }

    switch (user.type) {
      case USER.ROLES.ATTENDEE:
        if (
          ![
            "/attendee/profile",
            "/attendee/wheel",
            "/attendee/badgedex",
            "/attendee/leaderboard",
            "/attendee/store",
            "/attendee/vault",
            "/attendee/identifier",
            "/attendees/[uuid]",
            "/badge/[slug]",
            "/product/[slug]",
          ].includes(router.pathname)
        ) {
          return router.replace("/404");
        }
        break;
      case USER.ROLES.STAFF:
        if (
          ![
            "/staff/badges",
            "/staff/prizes",
            "/staff/prizes/[uuid]",
            "/staff/identifier",
            "/staff/leaderboard",
            "/attendees/[uuid]",
          ].includes(router.pathname)
        ) {
          return router.replace("/404");
        }
        break;
      case USER.ROLES.SPONSOR:
        if (
          ![
            "/sponsor/scanner",
            "/attendees/[uuid]",
            "/staff/badges",
            "/sponsor/visitors",
          ].includes(router.pathname)
        ) {
          return router.replace("/404");
        }
        break;
    }

    return <WrappedComponent {...props} />;
  };
}
