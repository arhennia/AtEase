import React from 'react';
import { LegalLayout, LegalSection, ReviewNote } from '../components/platform/LegalLayout';

export function Terms() {
  return (
    <LegalLayout
      title="Terms"
      lede="These terms describe the AtEase booking site and studio dashboard as they work today. Creating a studio account is the point at which an owner uses the product under these terms."
    >
      <ReviewNote>
        A legal entity name, registered address, governing law, and how a dispute would be handled are not decided
        in the product. They need review. Nothing on this page is a certification, a guarantee of uptime, or a
        promise about refunds beyond what the app currently does when Razorpay reports a refund.
      </ReviewNote>

      <LegalSection title="The product">
        <p>
          AtEase gives a studio owner a dashboard and a booking page under their brand. Clients request time with
          that studio. AtEase is not the beauty provider for those appointments.
        </p>
        <p>
          The studio owner is responsible for the services, prices, hours, and photos they publish, and for whether
          they accept a requested time.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          Running a studio requires an account. Sign-in can be Google, a one-time code to a mobile number, or email
          and a password, through Supabase Auth.
        </p>
        <p>You need to keep access to the email or phone number you used. Do not use another person’s account.</p>
      </LegalSection>

      <LegalSection title="Plans and payment">
        <p>
          A new studio starts on a trial. The trial length in the product is 14 days. Paid plans are the ones shown
          in the product, currently the monthly Self-Managed and Managed prices stored as plans.
        </p>
        <p>
          Payment is taken by Razorpay. A paid plan is marked active only after AtEase’s server confirms the
          payment. Closing the checkout window does not start a paid plan. A failed payment does not start one.
        </p>
        <p>
          If the owner cancels a paid plan in the dashboard, the app marks that plan cancelled and paid tools stay
          paused until a later confirmed payment. If Razorpay reports a full refund of the payment that started the
          current period, the app marks the plan refunded.
        </p>
        <ReviewNote>
          Whether a studio is entitled to money back, and any notice before a price change, are not set in the
          product. Do not treat this page as a refund policy until that is reviewed.
        </ReviewNote>
      </LegalSection>

      <LegalSection title="Bookings">
        <p>
          A client can send a booking request with their name and phone number. AtEase stores that request for the
          studio and opens WhatsApp with a draft that includes the name, services, date, time, and total when a
          price is shown.
        </p>
        <p>
          AtEase does not promise that the studio will confirm, keep, or complete the appointment. The conversation
          after WhatsApp opens is between the client and the studio.
        </p>
      </LegalSection>

      <LegalSection title="What you upload">
        <p>
          Images for the menu, portfolio, and brand are stored so the studio page can show them. Those image folders
          are publicly readable. Do not upload a file you do not have the right to show.
        </p>
      </LegalSection>

      <LegalSection title="What AtEase does not promise">
        <p>
          The site can be unavailable, a payment can fail, and a booking message can fail to open WhatsApp. AtEase
          does not promise uninterrupted service or that every booking request becomes an appointment.
        </p>
        <ReviewNote>
          A cap on liability is not stated here. Adding one needs review.
        </ReviewNote>
      </LegalSection>

      <LegalSection title="Changes to these pages">
        <p>
          If these pages change, the date at the top will change with them. The product does not currently email
          users when that happens.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
