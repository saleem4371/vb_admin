"use client";
import { redirect,useParams } from "next/navigation";
export default function VendorListPage() {

   const params = useParams();
  const vendor_id = params.id;

  redirect(`/vendors/${vendor_id}/vendor_list/vendor-information`);

}


