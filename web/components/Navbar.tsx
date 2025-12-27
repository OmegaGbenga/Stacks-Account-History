import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { authenticate, getUserData } from '@/lib/stacks-connect';
import { initWalletConnect } from '@/lib/wallet-connect';

export const Navbar = () => {
