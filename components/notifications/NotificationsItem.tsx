import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { BsTwitter } from "react-icons/bs";

export interface Notification {
  id: string;
  type: string;
  actorId: string;
  actor: {
    name: string;
    username: string;
  };
  post?: {
    id: string;
  };
  body: string;
  createdAt: string;
}

export interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const getLinkHref = () => {
    if (notification.type === "follow") {
      return `/users/${notification.actorId}`;
    } else if (notification.post) {
      return `/posts/${notification.post.id}`;
    } else {
      return "#"; // Fallback to a safe value
    }
  };

  const createdAt = useMemo(() => {
    if (!notification.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(notification.createdAt));
  }, [notification.createdAt]);

  return (
    <Link href={getLinkHref()} key={notification.id}>
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
          <span>{notification.body}</span>{" "}
          <span className="text-neutral-500">{createdAt} ago</span>
        </div>
      </div>
    </Link>
  );
};
export default NotificationItem;
