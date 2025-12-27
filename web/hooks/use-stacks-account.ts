import { useState, useEffect } from 'react';
import { getUserData, userSession } from '@/lib/stacks-connect';

export function useStacksAccount() {
