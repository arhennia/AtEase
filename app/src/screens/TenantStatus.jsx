import React from 'react';
import { Link } from 'react-router-dom';

export function TenantNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md text-center space-y-4">
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">Unknown brand site</p>
        <h1 className="font-serif text-3xl tracking-tight text-[#111111]">This page is private</h1>
        <p className="text-sm text-stone-600 font-light">
          There is no booking site at this address. Ask your specialist for their personal booking link.
        </p>
      </div>
    </div>
  );
}

export function TenantOffline({ brandName, isOwnerPreview }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md text-center space-y-4">
        <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">Site paused</p>
        <h1 className="font-serif text-3xl tracking-tight text-[#111111]">
          {brandName || 'This studio'} is temporarily offline
        </h1>
        <p className="text-sm text-stone-600 font-light">
          The owner&apos;s trial or subscription is inactive, so this booking page is not serving clients.
        </p>
        {isOwnerPreview && (
          <Link
            to="/dashboard"
            className="inline-block bg-[#111111] text-white px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold"
          >
            Renew from dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
