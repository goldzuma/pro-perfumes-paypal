import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-amber-900/30 text-amber-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Logo & Address */}
          <div className="space-y-4">
            <img
              src="https://horizons-cdn.hostinger.com/aafcd953-4852-4481-80c1-8dd4a68b33c3/656dcec386c1ca1ff07edfc6cb2f4d45.png"
              alt="Velour Perfumes"
              className="h-12 w-auto mb-4"
            />
            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
              <p className="text-amber-100/80">
                Velour Perfumes<br />
                Rua Dr. Luiz Augusto Puperi, 1100 Sala 201<br />
                Centro - Guaporé - RS - Brasil<br />
                CEP: 99200-000
              </p>
            </div>
          </div>

          {/* Center Column - Menu */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 tracking-wide">Menu</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-amber-100/80 hover:text-amber-400 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-amber-100/80 hover:text-amber-400 transition-colors text-sm"
              >
                Quem Somos
              </Link>
              <Link
                to="/return-policy"
                className="text-amber-100/80 hover:text-amber-400 transition-colors text-sm"
              >
                Política de Devolução e Troca
              </Link>
              <Link
                to="/catalog"
                className="text-amber-100/80 hover:text-amber-400 transition-colors text-sm"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Right Column - Contact */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 tracking-wide">Contato</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/5554999768543"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-amber-100/80 hover:text-amber-400 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: (54) 99976-8543</span>
              </a>
              <p className="text-amber-100/60 text-xs mt-4">
                Horário de atendimento:<br />
                Segunda a Sexta: 9h às 18h<br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-900/30 mt-8 pt-6 text-center">
          <p className="text-amber-100/60 text-sm">
            © {new Date().getFullYear()} Velour Perfumes. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;