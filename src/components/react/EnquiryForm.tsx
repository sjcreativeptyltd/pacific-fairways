import { useState } from 'react';

// Interactive island: client-side form state + Formspree submission.
// Endpoint comes from PUBLIC_FORMSPREE_ENDPOINT (see .env.example).

const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT ?? '';

export default function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const form = e.currentTarget;
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('done');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return <p>Thanks — we'll be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4">
      <input type="text" name="name" placeholder="Full name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="tel" name="phone" placeholder="Phone" />
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Enquire now'}
      </button>
      {status === 'error' && <p>Something went wrong — please try again.</p>}
    </form>
  );
}
