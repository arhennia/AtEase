import React from 'react';
import { LegalLayout, LegalSection, ReviewNote } from '../components/platform/LegalLayout';

export function Privacy() {
  return (
    <LegalLayout
      title="Privacy"
      lede="This page describes what AtEase stores when a studio owner signs in, sets up a booking page, or when a client requests a booking. It follows the product as it works today."
    >
      <ReviewNote>
        The legal name of the business, a registered address, and which email should receive privacy requests still
        need review. The home page currently lists arhennia@gmail.com as a contact. That is the address published on
        the site. It has not been confirmed here as a formal privacy contact.
      </ReviewNote>

      <LegalSection title="Who uses AtEase">
        <p>
          AtEase is a booking site and dashboard for an independent beauty studio. A studio owner creates an account
          and a page under their own name. A client can request a booking on that page without creating an AtEase
          account.
        </p>
      </LegalSection>

      <LegalSection title="Accounts and sign-in">
        <p>Studio sign-in is handled by Supabase Auth. The options in the product are:</p>
        <p>Google, a one-time code sent to a mobile number, and email with a password.</p>
        <p>
          The account record includes the user id Supabase assigns, and the email or phone number that sign-in
          returns. The password is handled by Supabase Auth. AtEase does not keep the password in the signup note
          saved in the browser.
        </p>
      </LegalSection>

      <LegalSection title="Studio and business information">
        <p>For a studio, the product stores details the owner enters, including:</p>
        <p>
          Brand name, owner name, email, phone, WhatsApp number, page address, description, location, working hours,
          service area, coverage radius, colours, logo and cover image, services, packages, and the text and images
          on the published site.
        </p>
        <p>
          A VIP list, when the owner uses it, stores the client name, phone number, and the package name the owner
          attached.
        </p>
      </LegalSection>

      <LegalSection title="Bookings and clients">
        <p>
          A booking request stores the client name, phone number, the service or package, date and time, place, and
          amount shown at booking. That request is saved for the studio it was made with.
        </p>
        <p>
          The studio’s client list is built from those bookings. A client row keeps the name, phone number, and the
          booking count and amounts the app records for that studio. It is not a shared directory of clients across
          studios.
        </p>
      </LegalSection>

      <LegalSection title="WhatsApp">
        <p>
          After a client picks a time, AtEase opens WhatsApp to the studio’s saved number. The draft message includes
          the client’s name, the services, the date, the time, and the total when a price is shown.
        </p>
        <p>
          WhatsApp then carries the conversation. AtEase does not read or store the chat that continues inside
          WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="Images you upload">
        <p>
          Service images, portfolio images, and brand images are stored in Supabase Storage. Those folders are
          publicly readable so a published page can show the picture. Each file is stored under the signed-in user’s
          folder. Another signed-in user is not allowed to change that file.
        </p>
      </LegalSection>

      <LegalSection title="Where the data is kept">
        <p>
          Accounts, studio records, bookings, clients, and uploaded images are stored with Supabase. Sign-in with
          Google uses Google’s sign-in through Supabase Auth. Phone codes are sent through the phone provider
          configured on that Supabase project.
        </p>
      </LegalSection>

      <LegalSection title="Payments">
        <p>
          Paid studio plans use Razorpay. The prices are the plan amounts stored for the product. Checkout opens in
          Razorpay. AtEase stores the plan, its status, the period dates, and the Razorpay order and payment
          identifiers that come back after a confirmed payment.
        </p>
        <p>AtEase does not store card numbers. Card entry happens in Razorpay’s checkout.</p>
      </LegalSection>

      <LegalSection title="What stays in the browser">
        <p>
          An unfinished signup is saved in the browser under the name atease-whitelabel-v1. That note can include
          the email, name, and user id. A password is not kept in it.
        </p>
        <p>
          Supabase Auth keeps the sign-in session in the browser’s local storage so the owner stays signed in.
          Studio records, bookings, and menus are not kept there as the source of truth.
        </p>
        <p>
          This application does not set its own cookies. Google’s sign-in page and Razorpay’s checkout are those
          services’ pages.
        </p>
      </LegalSection>

      <LegalSection title="How long information is kept">
        <ReviewNote>
          The app does not delete accounts, bookings, or files on a fixed timetable. How long each kind of record is
          kept, and how someone asks for a copy or for deletion, needs review before it is promised here.
        </ReviewNote>
      </LegalSection>
    </LegalLayout>
  );
}
