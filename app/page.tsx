import SearchForm from "@/components/SearchForm";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  return (
    <div className="flex flex-col">


      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full text-cyan-700 text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Doctores verificados
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Encuentra al{" "}
              <span className="text-cyan-700">
                profesional de la salud ideal
              </span>{" "}
              para ti
            </h1>

            {/* Subheading */}
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
              Busca entre cientos de consultorios médicos y agenda tu cita online de forma rápida y segura.
            </p>

            {/* Search Form */}
            <div className="max-w-3xl mx-auto">
              <SearchForm size="large" />
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Doctores" },
                { value: "50+", label: "Especialidades" },
                { value: "20+", label: "Ciudades" },
                { value: "10K+", label: "Pacientes" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Te conectamos con los mejores profesionales de la salud de manera fácil y segura.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Doctores Verificados",
                description: "Todos nuestros profesionales pasan por un proceso de verificación riguroso.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Agenda Rápida",
                description: "Reserva tu cita en segundos, sin llamadas ni esperas innecesarias.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Cerca de Ti",
                description: "Encuentra especialistas en tu ciudad o consultas virtuales desde cualquier lugar.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="
                  group p-8
                  bg-slate-50
                  rounded-2xl
                  border border-slate-200
                  hover:border-cyan-300
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                <div className="
                  w-14 h-14 rounded-xl
                  bg-gradient-to-br from-cyan-600 to-cyan-700
                  text-white
                  flex items-center justify-center
                  mb-6
                  group-hover:scale-110
                  transition-transform duration-300
                  shadow-lg
                ">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner - Inline */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner slot="inline" />
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-cyan-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Eres profesional de la salud?
          </h2>
          <p className="text-cyan-100 text-lg mb-8">
            Únete a nuestra red de doctores verificados y conecta con más pacientes.
          </p>
          <a
            href="#"
            className="
              inline-flex items-center gap-2
              px-8 py-4
              bg-white
              text-cyan-700
              font-semibold
              rounded-xl
              shadow-xl hover:shadow-2xl
              transform hover:scale-105
              transition-all duration-200
            "
          >
            Registrar mi Consultorio
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Ad Banner - Footer */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner slot="footer" />
      </div>
    </div>
  );
}
