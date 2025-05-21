import { User, MapPin, Mail, Calendar, Award } from "lucide-react"

function DentistCard({ dentista }) {
  if (!dentista) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center justify-center h-64">
        <p className="text-gray-500 text-center">Informações do dentista não disponíveis.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-custom-teal to-sky-700 h-24 relative">
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
              {dentista.usuario?.avatar ? (
                <img
                  src={dentista.usuario.avatar || "/placeholder.svg"}
                  alt={dentista.usuario?.nome || "Dentista"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={36} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{dentista.usuario?.nome || "Nome não disponível"}</h3>

        <div className="flex items-center gap-2 mb-3 text-custom-teal-2">
          <Award size={18} />
          <span className="font-medium">CRO: {dentista.numero_cro || "Não informado"}</span>
        </div>

        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{dentista.usuario?.email || "Email não informado"}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span>
              {dentista.usuario?.cidade || "Cidade não informada"}
              {dentista.usuario?.cidade && dentista.usuario?.estado && ", "}
              {dentista.usuario?.estado || ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400 flex-shrink-0" />
            <span>
              {dentista.usuario?.data_nascimento
                ? new Date(dentista.usuario.data_nascimento).toLocaleDateString()
                : "Data não informada"}
            </span>
          </div>
        </div>

        <button className="mt-4 w-full bg-custom-teal-2 hover:bg-custom-teal-dark font-semibold text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2">
          Agendar Consulta
        </button>
      </div>
    </div>
  )
}

export default DentistCard
