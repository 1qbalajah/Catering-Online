import Link from "next/link";

export default function InvoiceButton({ orderId }: { orderId: string }) {
  return (
    <Link className="button compact secondary" href={`/api/invoice/${orderId}`} target="_blank">
      Download Struk
    </Link>
  );
}
