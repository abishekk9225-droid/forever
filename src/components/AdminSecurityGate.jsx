import React from 'react';
import PasscodeGate from './PasscodeGate';

export default function AdminSecurityGate({ onUnlocked, onUnlock }) {
  return <PasscodeGate onUnlock={onUnlocked || onUnlock} onUnlocked={onUnlocked || onUnlock} />;
}
