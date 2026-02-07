import React from "react";
import { Mail, MapPin, Linkedin, Globe } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Contact Info */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
              GET IN TOUCH
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Available for freelance projects and studio collaborations. Let's
              discuss your next architectural visualisation project.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-900 rounded-none">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:rubenoconnor314@outlook.com"
                    className="text-xl hover:text-gray-300 transition-colors break-all"
                  >
                    rubenoconnor314@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-900 rounded-none">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-1">
                    Location
                  </h3>
                  <p className="text-xl">United Kingdom</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-900 rounded-none">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-1">
                    Portfolio
                  </h3>
                  <a
                    href="https://www.artstation.com/rubenoconnor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl hover:text-gray-300 transition-colors"
                  >
                    ArtStation
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/rubenoconnor"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-neutral-900 hover:bg-[#0077b5] hover:text-white transition-all duration-300"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.artstation.com/rubenoconnor"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-neutral-900 hover:bg-[#13aff0] hover:text-white transition-all duration-300 flex items-center justify-center font-bold text-lg w-[58px]"
              >
                AS
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-6 w-full md:w-1/2"
            action="https://api.web3forms.com/submit"
            method="POST"
          >
            {/* Web3Forms Access Key */}
            <input
              type="hidden"
              name="access_key"
              value="5d50f5c5-232e-40ce-829f-602085076295"
            />

            {/* Fixed email subject (for Outlook rules) */}
            <input
              type="hidden"
              name="subject"
              value="New Portfolio Contact Submission"
            />
            <input
              type="hidden"
              name="email_subject"
              value="New Portfolio Contact Submission"
            />

            {/* Honeypot spam protection */}
            <input type="checkbox" name="botcheck" className="hidden" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm uppercase tracking-widest text-gray-500"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm uppercase tracking-widest text-gray-500"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="Your Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="text-sm uppercase tracking-widest text-gray-500"
              >
                Subject
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                className="w-full bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="Project Inquiry"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm uppercase tracking-widest text-gray-500"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-white transition-colors resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
