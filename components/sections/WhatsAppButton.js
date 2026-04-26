'use client'

const WA_CSS = `
  @keyframes waPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0), 0 8px 32px rgba(37,211,102,.4); }
    50%      { box-shadow: 0 0 0 12px rgba(37,211,102,.15), 0 8px 32px rgba(37,211,102,.5); }
  }
  @keyframes waBounce {
    0%,100% { transform: translateY(0) scale(1); }
    30%     { transform: translateY(-6px) scale(1.08); }
    60%     { transform: translateY(-2px) scale(1.03); }
  }
  @keyframes waTooltip {
    from { opacity:0; transform:translateX(10px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes waDot {
    0%,100% { opacity:1; }
    50%     { opacity:.4; }
  }

  .wa-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, #25d366, #128c5e);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: waPulse 2.5s ease-in-out infinite;
    transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    text-decoration: none;
  }
  .wa-btn:hover {
    animation: waBounce .6s ease forwards, waPulse 2.5s ease-in-out 0.6s infinite;
    transform: scale(1.12);
  }
  .wa-btn svg {
    width: 30px;
    height: 30px;
    fill: #fff;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,.25));
    transition: transform .3s;
  }
  .wa-btn:hover svg {
    transform: rotate(-8deg) scale(1.1);
  }

  /* tooltip */
  .wa-tooltip {
    position: fixed;
    bottom: 38px;
    right: 96px;
    z-index: 9998;
    background: rgba(18,140,94,.95);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: .8rem;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 10px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateX(10px);
    transition: opacity .3s, transform .3s;
    letter-spacing: .3px;
  }
  .wa-tooltip::after {
    content: '';
    position: absolute;
    right: -7px;
    top: 50%;
    transform: translateY(-50%);
    border: 7px solid transparent;
    border-right: none;
    border-left-color: rgba(18,140,94,.95);
  }
  .wa-wrap:hover .wa-tooltip {
    opacity: 1;
    transform: translateX(0);
    animation: waTooltip .3s ease forwards;
  }

  /* online dot */
  .wa-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #25d366;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wa-dot::after {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #25d366;
    animation: waDot 1.5s ease-in-out infinite;
  }

  @media (max-width: 600px) {
    .wa-btn    { bottom: 20px; right: 20px; width: 52px; height: 52px; }
    .wa-tooltip{ bottom: 30px; right: 82px; }
  }
`

export default function WhatsAppButton({ phone = '+923271348097', message = 'Hi Ahsan! I visited your portfolio and would like to get in touch.' }) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <>
      <style>{WA_CSS}</style>

      <div className="wa-wrap">
        {/* tooltip */}
        <div className="wa-tooltip">💬 Chat on WhatsApp</div>

        {/* button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-btn"
          aria-label="Chat on WhatsApp"
        >
          {/* WhatsApp SVG icon */}
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.002 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.363.627 4.608 1.72 6.557L2.667 29.333l6.98-1.698A13.27 13.27 0 0016.002 29.333C23.368 29.333 29.333 23.364 29.333 16S23.368 2.667 16.002 2.667zm0 2.4c5.96 0 10.8 4.84 10.8 10.8 0 5.96-4.84 10.8-10.8 10.8a10.76 10.76 0 01-5.44-1.465l-.39-.232-4.045.983.996-3.934-.255-.407A10.757 10.757 0 015.2 16c0-5.96 4.843-10.933 10.803-10.933zm-3.04 5.466c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3s1.29 3.48 1.47 3.72c.18.24 2.52 3.96 6.18 5.4 3.66 1.44 3.66.96 4.32.9.66-.06 2.13-.87 2.43-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42-.36-.18-2.13-1.05-2.46-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.518-.558-2.892-1.782-1.07-.95-1.79-2.124-2.002-2.484-.21-.36-.022-.555.158-.733.162-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.3-.72-.606-.618-.81-.63a14.9 14.9 0 00-.69-.015z"/>
          </svg>

          {/* online indicator dot */}
          <span className="wa-dot"/>
        </a>
      </div>
    </>
  )
}