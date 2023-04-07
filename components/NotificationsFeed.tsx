import { useEffect } from "react";
import { BsTwitter } from "react-icons/bs";
import Link from "next/link";

import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";

const NotificationsFeed = () => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { data: fetchedNotifications = [] } = useNotifications(currentUser?.id);

  const getLinkHref = () => {
    if (fetchedNotifications.type === "follow") {
      return `/users/${fetchedNotifications.actor.username}`;
    } else if (fetchedNotifications.post) {
      return `/posts/${fetchedNotifications.post.id}`;
    } else {
      return "#"; // Fallback to a safe value
    }
  };

  useEffect(() => {
    mutateCurrentUser();
  }, [mutateCurrentUser]);

  if (fetchedNotifications.length === 0) {
    return (
      <div
        className="
            text-neutral-600
            text-center
            p-6
            text-xl
        "
      >
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {fetchedNotifications.map((notification: Record<string, any>) => {
        const getLinkHref = (notification: Record<string, any>) => {
          if (notification.type === "follow") {
            return `/users/${notification.actorId}`;
          } else if (notification.post) {
            return `/posts/${notification.post.id}`;
          } else {
            return "#"; // Fallback to a safe value
          }
        };

        return (
          <Link href={getLinkHref(notification)} key={notification.id}>
            <div
              className="
                flex
                flex-row
                items-center
                p-6
                gap-4
                border-b-[1px]
                border-neutral-800
                hover:bg-neutral-900
                cursor-pointer
              "
            >
              <BsTwitter color="white" size={32} />
              <div className="text-white">
                <span className="font-bold">{notification.actor.name}</span>
                <span> @{notification.actor.username}</span>{" "}
                <span>{notification.body}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default NotificationsFeed;
