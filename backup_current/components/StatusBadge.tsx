"use client";

export function StatusBadge({ status }: { status: string }) {
  let color = "gray";

  switch (status) {
    case "PENDING":
      color = "yellow";
      break;
    case "PREPARING":
      color = "blue";
      break;
    case "READY":
      color = "green";
      break;
    case "COMPLETED":
      color = "gray";
      break;
    case "PAID":
      color = "green";
      break;
    case "FAILED":
      color = "red";
      break;
  }

  return (
    <span
      className={`px-2 py-1 rounded text-white text-xs font-semibold bg-${color}-600`}
    >
      {status}
    </span>
  );
}


export default StatusBadge;
