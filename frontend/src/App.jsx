import { useState, useEffect } from 'react'

function App() {
  const [fraseActual, setFraseActual] = useState("");
  const [tiempoJuntos, setTiempoJuntos] = useState({ anios: 0, meses: 0, dias: 0 });
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);
  
  // Estado para controlar en qué sección estamos
  const [pestanaActiva, setPestanaActiva] = useState("fotos"); // "fotos" o "recordatorios"

  // Estados para la Galería
  const [fotos, setFotos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  // Estados para los Recordatorios
  const [recordatorios, setRecordatorios] = useState([]);
  const [modalRecordatorio, setModalRecordatorio] = useState(false);
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({ title: "", description: "", date: "" });
  const [guardandoRecordatorio, setGuardandoRecordatorio] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    // Frases aleatorias
    const frases = [
      "Eres mi coincidencia favorita.",
  "Mi lugar favorito en el mundo es a tu lado.",
  "Contigo, todos los días son especiales.",
  "Te elegiría a ti en cien vidas y en cien mundos distintos.",
  "Haces que mi mundo sea más bonito solo con existir.",
  "No hay instante en el que no piense en ti.",
  "Mi parte favorita del día es cuando estoy contigo.",
  "Eres la calma que nunca supe que necesitaba.",
  "Si el tiempo se detuviera, elegiría este momento contigo.",
  "Tu sonrisa siempre encuentra el camino hacia mí.",
  "No importa el lugar, mientras sea contigo.",
  "Cada día contigo parece una canción nueva.",
  "Llegaste sin avisar y te volviste mi hogar.",
  "Hay personas que iluminan una habitación; tú iluminas mi vida.",
  "Quisiera perderme contigo una y otra vez.",
  "Nunca imaginé que alguien pudiera sentirse como un hogar.",
  "A veces solo quiero mirarte en silencio.",
  "Eres mi estación favorita.",
  "Todo tiene sentido cuando apareces.",

  "You feel like home.",
  "You're my favorite chapter.",
  "Every sunset reminds me of you.",
  "I'd find you in every lifetime.",
  "You're the calm after every storm.",
  "I could stay in this moment forever.",
  "You make ordinary days unforgettable.",
  "You are my favorite hello.",
  "The stars look brighter when you're here.",
  "If I had one wish, it would always be you.",
  "You're the song I never skip.",
  "Even silence feels warm with you.",
  "I hope every road leads back to you.",
  "You're the peace I've been looking for.",
  "Some people are poetry. You're my favorite poem.",
  "Forever sounds beautiful with you.",
  "Your laugh is my favorite melody.",
  "You're the best part of every day.",

  "Tu es mon endroit préféré.",
  "Avec toi, le temps s'arrête.",
  "Tu fais battre mon cœur un peu plus fort.",
  "Je te choisirais encore et encore.",
  "Tu es mon plus beau hasard.",
  "Reste encore un peu avec moi.",
  "Dans tes yeux, je trouve la paix.",
  "Chaque instant avec toi est précieux.",
  "Tu es la plus belle partie de mes journées.",
  "Je pourrais te regarder pendant des heures.",
  "Le monde est plus doux avec toi.",
  "Tu es mon rayon de soleil.",
  "Je n'ai besoin de rien d'autre que de toi.",
  "Tu rends tout plus beau.",
  "À tes côtés, je suis chez moi.",

  "Ты — мой любимый человек.",
  "С тобой время словно останавливается.",
  "Ты делаешь мой мир ярче.",
  "Я выберу тебя снова и снова.",
  "Ты — мой дом.",
  "Каждый день с тобой особенный.",
  "Ты — моя тихая гавань.",
  "Я счастлив рядом с тобой.",
  "Ты — моя самая красивая случайность.",
  "Без тебя мир кажется тише.",
  "Я нашёл покой в твоих глазах.",
  "Ты — моя любимая история.",
  "Пока ты рядом, всё хорошо.",
  "Ты — причина моей улыбки.",
  "Любовь похожа на тебя."
    ];
    setFraseActual(frases[Math.floor(Math.random() * frases.length)]);

    // Lógica del tiempo juntos
    const calcularTiempoJuntos = () => {
      const fechaInicio = new Date(2026, 5, 4);
      const ahora = new Date();
      let anios = ahora.getFullYear() - fechaInicio.getFullYear();
      let meses = ahora.getMonth() - fechaInicio.getMonth();
      let dias = ahora.getDate() - fechaInicio.getDate();

      if (dias < 0) {
        meses -= 1;
        const ultimoDiaMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
      }
      if (meses < 0) {
        anios -= 1;
        meses += 12;
      }
      setTiempoJuntos({ anios, meses, dias });
    };

    calcularTiempoJuntos();
    const timer = setInterval(calcularTiempoJuntos, 60000);
    
    // Cargar datos del backend
    cargarFotos();
    cargarRecordatorios();

    // Detección de celular vs computadora
    const manejarResize = () => setEsMovil(window.innerWidth <= 768);
    window.addEventListener('resize', manejarResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', manejarResize);
    };
  }, []);

  // --- LÓGICA DE FOTOS ---
  const cargarFotos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/photos/`);
      if (respuesta.ok) setFotos(await respuesta.json());
    } catch (error) { console.error("Error al cargar fotos:", error); }
  };

  const manejarSeleccionArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setVistaPrevia(URL.createObjectURL(file));
    }
  };

  const subirFoto = async (e) => {
    e.preventDefault();
    if (!archivo) return;
    setSubiendo(true);
    const formData = new FormData();
    formData.append("file", archivo);
    if (descripcion) formData.append("description", descripcion);

    try {
      const respuesta = await fetch(`${API_URL}/photos/`, { method: "POST", body: formData });
      if (respuesta.ok) {
        setModalAbierto(false); setArchivo(null); setVistaPrevia(null); setDescripcion("");
        cargarFotos();
      }
    } catch (error) { console.error(error); } 
    finally { setSubiendo(false); }
  };

  const eliminarFoto = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este hermoso recuerdo?")) {
      try {
        const respuesta = await fetch(`${API_URL}/photos/${id}`, { method: 'DELETE' });
        if (respuesta.ok) cargarFotos();
      } catch (error) { console.error(error); }
    }
  };

  // --- LÓGICA DE RECORDATORIOS ---
  const cargarRecordatorios = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/reminders/`);
      if (respuesta.ok) setRecordatorios(await respuesta.json());
    } catch (error) { console.error("Error al cargar recordatorios:", error); }
  };

  const crearRecordatorio = async (e) => {
    e.preventDefault();
    if (!nuevoRecordatorio.title || !nuevoRecordatorio.date) return;
    
    setGuardandoRecordatorio(true);

    // Cambiamos 'date' por 'event_date' para que coincida con lo que espera tu backend
    const payload = {
      title: nuevoRecordatorio.title,
      description: nuevoRecordatorio.description,
      event_date: `${nuevoRecordatorio.date}T00:00:00` // Usamos el nombre correcto
    };

    try {
      const respuesta = await fetch(`${API_URL}/reminders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (respuesta.ok) {
        setModalRecordatorio(false);
        setNuevoRecordatorio({ title: "", description: "", date: "" });
        cargarRecordatorios();
      } else {
        const errorDetail = await respuesta.json();
        console.error("Error de validación:", errorDetail);
        alert("Error: " + JSON.stringify(errorDetail));
      }
    } catch (error) { 
      console.error(error); 
    } finally { 
      setGuardandoRecordatorio(false); 
    }
  };

  const formatearFecha = (fechaString) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(fechaString);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="min-h-screen font-sans bg-amor-grisclaro relative">
      
      {/* Navegación */}
      <nav className="bg-amor-blanco shadow-sm py-4 px-6 sticky top-0 z-40 border-b border-amor-rosa">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-amor-rojo tracking-wide flex items-center gap-2">
            <span>❤️</span> Nuestro Espacio
          </div>
          <div className="space-x-2 sm:space-x-6 text-amor-gristexto font-medium flex">
            <button 
              onClick={() => setPestanaActiva("fotos")}
              className={`transition-colors px-2 py-1 ${pestanaActiva === "fotos" ? "text-amor-rojo border-b-2 border-amor-rojo" : "hover:text-amor-rosafuerte"}`}
            >
              Recuerdos
            </button>
            <button 
              onClick={() => setPestanaActiva("recordatorios")}
              className={`transition-colors px-2 py-1 ${pestanaActiva === "recordatorios" ? "text-amor-rojo border-b-2 border-amor-rojo" : "hover:text-amor-rosafuerte"}`}
            >
              Fechas
            </button>
          </div>
        </div>
      </nav>

      {/* Hero (Contador) */}
      <header className="bg-gradient-to-b from-amor-rosa to-amor-grisclaro py-12 px-6 text-center shadow-inner">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-amor-rojo font-bold mb-4 animate-fade-in">
            {fraseActual}
          </h2>
          <div className="bg-amor-blanco p-6 md:p-8 rounded-3xl shadow-lg inline-block border-t-4 border-amor-rojo mt-6">
            <p className="text-sm text-amor-gristexto uppercase tracking-widest mb-6 font-semibold">
              Escribiendo nuestra historia desde hace:
            </p>
            <div className="flex space-x-4 md:space-x-8 justify-center items-center text-amor-rojo">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-bold bg-amor-grisclaro px-4 py-3 rounded-2xl text-amor-rojo shadow-sm">{tiempoJuntos.anios}</span>
                <span className="text-xs md:text-sm font-bold text-amor-rosafuerte mt-3 uppercase tracking-wider">{tiempoJuntos.anios === 1 ? 'Año' : 'Años'}</span>
              </div>
              <span className="text-3xl font-bold text-amor-rosa mb-8">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-bold bg-amor-grisclaro px-4 py-3 rounded-2xl text-amor-rojo shadow-sm">{tiempoJuntos.meses.toString().padStart(2, '0')}</span>
                <span className="text-xs md:text-sm font-bold text-amor-rosafuerte mt-3 uppercase tracking-wider">{tiempoJuntos.meses === 1 ? 'Mes' : 'Meses'}</span>
              </div>
              <span className="text-3xl font-bold text-amor-rosa mb-8">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-bold bg-amor-rojo px-4 py-3 rounded-2xl text-amor-blanco shadow-md">{tiempoJuntos.dias.toString().padStart(2, '0')}</span>
                <span className="text-xs md:text-sm font-bold text-amor-rosafuerte mt-3 uppercase tracking-wider">{tiempoJuntos.dias === 1 ? 'Día' : 'Días'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Dinámico (Fotos o Recordatorios) */}
      <main className="max-w-4xl mx-auto py-12 px-6">
        
        {/* === PESTAÑA: GALERÍA DE FOTOS === */}
        {pestanaActiva === "fotos" && (
          <>
            <div className="flex items-center justify-between mb-8 border-b-2 border-amor-rosa pb-2">
              <h3 className="text-2xl font-bold text-gray-800">Nuestros Recuerdos</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div onClick={() => setModalAbierto(true)} className="bg-amor-blanco rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center h-72 border-2 border-dashed border-amor-rosafuerte cursor-pointer group">
                <div className="bg-amor-rosa bg-opacity-20 p-4 rounded-full mb-4 group-hover:bg-amor-rojo group-hover:text-amor-blanco transition-all text-4xl shadow-sm">📸</div>
                <p className="text-amor-gristexto font-medium group-hover:text-amor-rojo transition-colors">Subir nuevo recuerdo</p>
              </div>
              {fotos.map((foto) => (
                <div key={foto.id} className="bg-amor-blanco rounded-2xl shadow-sm overflow-hidden h-72 group relative">
                  <img src={foto.image_url} alt="Recuerdo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {foto.description && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{foto.description}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={foto.image_url} download target="_blank" rel="noreferrer" className="bg-amor-blanco p-3 rounded-full hover:bg-amor-rosafuerte hover:text-white transition-colors shadow-lg" title="Descargar foto">⬇️</a>
                    {!esMovil && (
                      <button onClick={() => eliminarFoto(foto.id)} className="bg-amor-blanco p-3 rounded-full hover:bg-amor-rojo hover:text-white transition-colors shadow-lg" title="Borrar recuerdo">🗑️</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === PESTAÑA: RECORDATORIOS === */}
        {pestanaActiva === "recordatorios" && (
          <>
            <div className="flex items-center justify-between mb-8 border-b-2 border-amor-rosa pb-2">
              <h3 className="text-2xl font-bold text-gray-800">Fechas Inolvidables</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Botón de Agregar Recordatorio */}
              <div 
                onClick={() => setModalRecordatorio(true)}
                className="bg-amor-blanco rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center border-2 border-dashed border-amor-rosafuerte cursor-pointer group py-12"
              >
                <div className="bg-amor-rosa bg-opacity-20 p-4 rounded-full mb-4 group-hover:bg-amor-rojo group-hover:text-amor-blanco transition-all text-4xl shadow-sm">
                  📅
                </div>
                <p className="text-amor-gristexto font-medium group-hover:text-amor-rojo transition-colors">Agendar nueva fecha</p>
              </div>

                
              {/* Lista de Recordatorios */}
{recordatorios.map((rec) => (
  <div key={rec.id} className="bg-amor-blanco rounded-2xl shadow-sm p-6 border-l-4 border-amor-rojo relative group hover:shadow-md transition-shadow flex flex-col">
    
    {/* Contenedor de acciones en la esquina superior derecha */}
    <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
      {/* Botón Eliminar (Solo en PC) */}
      {!esMovil && (
        <button 
          onClick={async () => {
            if(window.confirm("¿Borrar esta fecha especial?")) {
              await fetch(`${API_URL}/reminders/${rec.id}`, { method: 'DELETE' });
              cargarRecordatorios();
            }
          }}
          className="p-2 text-gray-400 hover:text-amor-rojo transition-colors"
          title="Eliminar recordatorio"
        >
          🗑️
        </button>
      )}
      
      {/* Icono de pin (Chincheta) */}
      <div className="bg-amor-rosa bg-opacity-20 px-3 py-1 rounded-full text-lg">
        📌
      </div>
    </div>

    <h4 className="text-xl font-bold text-gray-800 mb-1 pr-16">{rec.title}</h4>
    <p className="text-sm font-semibold text-amor-rojo mb-3 capitalize">
      {formatearFecha(rec.event_date)}
    </p>
    {rec.description && (
      <p className="text-gray-600 text-sm bg-amor-grisclaro p-3 rounded-xl border border-gray-100 flex-grow">
        {rec.description}
      </p>
    )}
  </div>
))}
            </div>
          </>
        )}
      </main>

      {/* === MODALES === */}

      {/* Modal para subir foto */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-amor-rojo">Guardar un momento</h3>
                <button onClick={() => { setModalAbierto(false); setVistaPrevia(null); setArchivo(null); }} className="text-gray-400 hover:text-amor-rojo transition-colors text-2xl font-bold">&times;</button>
              </div>
              <form onSubmit={subirFoto} className="space-y-4">
                <div className="border-2 border-dashed border-amor-rosa rounded-xl h-56 flex items-center justify-center overflow-hidden relative bg-amor-grisclaro">
                  {vistaPrevia ? (
                    <img src={vistaPrevia} alt="Vista previa" className="w-full h-full object-cover" />
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer p-4 text-amor-gristexto hover:text-amor-rojo transition-colors w-full h-full justify-center">
                      <span className="text-4xl mb-3">☁️</span>
                      <span className="text-sm font-medium text-center px-4">Toca aquí para elegir una foto hermosa de ustedes</span>
                      <input type="file" accept="image/*" className="hidden" onChange={manejarSeleccionArchivo} />
                    </label>
                  )}
                  {vistaPrevia && (
                    <label className="absolute bottom-3 right-3 bg-amor-rojo text-white text-xs px-4 py-2 rounded-full cursor-pointer shadow-lg hover:bg-red-700 transition-colors">
                      Cambiar foto
                      <input type="file" accept="image/*" className="hidden" onChange={manejarSeleccionArchivo} />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unas palabras (opcional)</label>
                  <textarea rows="2" className="w-full border border-amor-rosa border-opacity-50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amor-rosa bg-amor-grisclaro text-gray-800" placeholder="Lo que sentiste en este momento..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                </div>
                <button type="submit" disabled={!archivo || subiendo} className={`w-full py-4 rounded-xl text-white font-bold transition-all text-lg ${!archivo || subiendo ? 'bg-gray-300 cursor-not-allowed' : 'bg-amor-rojo hover:bg-red-700 shadow-md hover:-translate-y-1'}`}>
                  {subiendo ? 'Guardando en la nube...' : 'Guardar Recuerdo ❤️'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agendar fecha (Recordatorios) */}
      {modalRecordatorio && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-amor-rojo flex items-center gap-2"><span>📅</span> Nueva Fecha Especial</h3>
                <button onClick={() => setModalRecordatorio(false)} className="text-gray-400 hover:text-amor-rojo transition-colors text-2xl font-bold">&times;</button>
              </div>
              <form onSubmit={crearRecordatorio} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">¿Qué celebramos o haremos?</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Cena de aniversario, Ir al cine..."
                    className="w-full border border-amor-rosa border-opacity-50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amor-rosa bg-amor-grisclaro text-gray-800"
                    value={nuevoRecordatorio.title}
                    onChange={(e) => setNuevoRecordatorio({...nuevoRecordatorio, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">¿Cuándo?</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full border border-amor-rosa border-opacity-50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amor-rosa bg-amor-grisclaro text-gray-800"
                    value={nuevoRecordatorio.date}
                    onChange={(e) => setNuevoRecordatorio({...nuevoRecordatorio, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Detalles (opcional)</label>
                  <textarea 
                    rows="2" 
                    placeholder="Llevar regalo, reservar mesa a las 8..."
                    className="w-full border border-amor-rosa border-opacity-50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amor-rosa bg-amor-grisclaro text-gray-800 resize-none"
                    value={nuevoRecordatorio.description}
                    onChange={(e) => setNuevoRecordatorio({...nuevoRecordatorio, description: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={guardandoRecordatorio}
                  className={`w-full py-4 mt-2 rounded-xl text-white font-bold transition-all text-lg ${guardandoRecordatorio ? 'bg-gray-300 cursor-not-allowed' : 'bg-amor-rosafuerte hover:bg-amor-rojo shadow-md hover:-translate-y-1'}`}
                >
                  {guardandoRecordatorio ? 'Agendando...' : 'Guardar Fecha 📌'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App