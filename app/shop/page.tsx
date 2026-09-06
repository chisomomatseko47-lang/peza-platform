import { redirect } from "next/navigation";

// This used to be a hardcoded demo storefront with fake products and a
// WhatsApp-based checkout. It's fully superseded by the real marketplace
// at shop.peza.africa, but stayed publicly reachable and could mislead
// someone into "ordering" a product Peza doesn't actually stock. Redirect
// instead of leaving it live.
export default function ShopRedirect() {
  redirect("https://shop.peza.africa/");
}
