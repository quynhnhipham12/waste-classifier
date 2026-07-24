import { useEffect, useState } from "react";
import apiClient from "../api/client";

function ContactLine({ label, value, link }) {
  if (!value) return null;
  const content = link ? (
    <a href={link} className="underline hover:text-white">{value}</a>
  ) : (
    value
  );
  return <li>{label}: {content}</li>;
}

function Footer() {
  const [settings, setSettings] = useState({
    logo_footer_url: null,
    brand_name: "EcoFlow",
    footer_description: "",
    footer_email: "",
    footer_email_link: "",
    footer_phone: "",
    footer_phone_link: "",
    footer_address: "",
    footer_address_link: "",
  });

  useEffect(() => {
    apiClient
      .get("/site-settings")
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gradient-to-br from-eco-primary to-eco-primary-dark text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {settings.logo_footer_url && (
              <img
                src={settings.logo_footer_url}
                alt={settings.brand_name}
                className="h-8 w-8 object-contain rounded-full"
              />
            )}
            <h3 className="font-display text-2xl font-bold">
              {settings.brand_name || "EcoFlow"}
            </h3>
          </div>
          <p className="font-body text-sm text-white/80 leading-relaxed">
            {settings.footer_description}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 font-body">Liên hệ</h4>
          <ul className="font-body text-sm text-white/80 space-y-2">
            <ContactLine label="Email" value={settings.footer_email} link={settings.footer_email_link} />
            <ContactLine label="Điện thoại" value={settings.footer_phone} link={settings.footer_phone_link} />
            <ContactLine label="Địa chỉ" value={settings.footer_address} link={settings.footer_address_link} />
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 font-body">Sứ mệnh</h4>
          <p className="font-body text-sm text-white/80 leading-relaxed">
            Hướng đến một môi trường sống xanh, không rác thải và không còn
            những biện pháp xử lý rác phi khoa học.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;