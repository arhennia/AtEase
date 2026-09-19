import React from 'react';
import { Link } from 'react-router-dom';

export function TenantNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] px-5 font-heroSans">
      <div className="max-w-md text-center space-y-4">
        <p className="text-[11px] tracking-[0.16em] uppercase text-stone-400">Unknown brand site</p>
        <h1 className="font-heroSans text-3xl font-semibold tracking-tight text-[#1C1917]">This page is private</h1>
        <p className="text-sm text-stone-500 leading-relaxed">
          There is no booking site at this address. Ask your specialist for their personal booking link.
        </p>
      </div>
    </div>
  );
}

export function TenantOffline({ brandName, isOwnerPreview }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] px-5 font-heroSans">
      <div className="max-w-md text-center space-y-4">
        <p className="text-[11px] tracking-[0.16em] uppercase text-stone-400">Site paused</p>
        <h1 className="font-heroSans text-3xl font-semibold tracking-tight text-[#1C1917]">
          {brandName || 'This studio'} is temporarily offline
        </h1>
        <p className="text-sm text-stone-500 leading-relaxed">
          The owner&apos;s trial or subscription is inactive, so this booking page is not serving clients.
        </p>
        {isOwnerPreview && (
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-[#1C1917] text-white px-5 py-2.5 text-[13px] font-medium"
          >
            Renew from dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
