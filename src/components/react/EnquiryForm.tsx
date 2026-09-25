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
    return <p className="enquiry-done">Thanks — we'll be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="enquiry-form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="fname">Name</label>
          <input id="fname" type="text" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="fphone">Phone</label>
          <input id="fphone" type="tel" name="phone" required autoComplete="tel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="femail">Email</label>
        <input id="femail" type="email" name="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="fmessage">Message</label>
        <textarea
          id="fmessage"
          name="message"
          placeholder="I'd like more information on lot availability at Pacific Fairways."
        />
      </div>
      <div className="form-foot">
        <button type="submit" className="btn btn-outline-dark" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
        </button>
        <span className="privacy">
          Your details are collected to respond to this enquiry and are handled in line with our
          privacy policy. We never share your information with third parties without consent.
        </span>
      </div>
      {status === 'error' && <p className="form-error">Something went wrong — please try again.</p>}
    </form>
  );
}
