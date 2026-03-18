import React from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Award, Heart, Shield } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Quem Somos - Velour Perfumes</title>
        <meta
          name="description"
          content="Conheça a história da Velour Perfumes, sua loja de fragrâncias premium e importadas."
        />
      </Helmet>

      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-light text-amber-100 mb-6">
              Quem Somos
            </h1>
            <p className="text-xl text-amber-100/80 font-light leading-relaxed">
              A Velour Perfumes nasceu da paixão por fragrâncias exclusivas e do desejo de
              proporcionar experiências olfativas únicas e memoráveis.
            </p>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-light text-amber-100 mb-6">Nossa História</h2>
              <div className="space-y-4 text-amber-100/80 leading-relaxed">
                <p>
                  Fundada com o compromisso de trazer ao Brasil as mais refinadas fragrâncias do
                  mundo, a Velour Perfumes se estabeleceu como referência em perfumes importados
                  de luxo.
                </p>
                <p>
                  Trabalhamos exclusivamente com as marcas mais prestigiadas do mercado
                  internacional: Chanel, Dior, Guerlain, Tom Ford e Creed. Cada perfume em nosso
                  catálogo é cuidadosamente selecionado para garantir autenticidade e qualidade
                  incomparável.
                </p>
                <p>
                  Nossa missão é democratizar o acesso a fragrâncias premium, oferecendo produtos
                  100% originais com preços justos e condições especiais de pagamento.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-amber-100 text-center mb-12">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl text-amber-100 font-light mb-3">Autenticidade</h3>
                <p className="text-amber-100/70 text-sm">
                  Todos os nossos produtos são 100% originais e importados diretamente das marcas
                </p>
              </div>

              <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl text-amber-100 font-light mb-3">Excelência</h3>
                <p className="text-amber-100/70 text-sm">
                  Compromisso com a qualidade em cada detalhe, do produto ao atendimento
                </p>
              </div>

              <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl text-amber-100 font-light mb-3">Paixão</h3>
                <p className="text-amber-100/70 text-sm">
                  Amor genuíno por fragrâncias e dedicação em proporcionar experiências únicas
                </p>
              </div>

              <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl text-amber-100 font-light mb-3">Exclusividade</h3>
                <p className="text-amber-100/70 text-sm">
                  Seleção criteriosa das fragrâncias mais refinadas e desejadas do mundo
                </p>
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-zinc-900 border border-amber-900/30 rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-light text-amber-100 mb-6 text-center">
                Marcas Exclusivas
              </h2>
              <p className="text-amber-100/80 text-center mb-8">
                Trabalhamos com as casas de perfumaria mais prestigiadas do mundo
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                {['Chanel', 'Dior', 'Guerlain', 'Tom Ford', 'Creed'].map((brand) => (
                  <div key={brand} className="text-amber-400 text-xl font-light">
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;