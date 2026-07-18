import { redirect } from 'next/navigation';

/** The panel has no landing page; the dashboard guards itself. */
export default function AdminHome() {
  redirect('/dashboard');
}
