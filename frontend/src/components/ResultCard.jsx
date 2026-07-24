import wasteInfo from "../data/wasteInfo";

function ResultCard({ result, onReset }) {
  const { annotated_image, detections } = result;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <img
        src={annotated_image}
        alt="Kết quả nhận diện"
        className="w-full rounded-3xl border border-eco-primary/10"
      />

      {detections.length === 0 ? (
        <p className="text-center font-body text-eco-ink/60">
          Không nhận diện được loại rác nào trong ảnh này. Thử lại với ảnh rõ nét hơn nhé.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {detections.map((d, i) => {
            const info = wasteInfo[d.class_name];
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-eco-primary/10">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`bg-${info?.color || "eco-primary"} text-white text-sm font-semibold px-4 py-1.5 rounded-full`}
                  >
                    {d.class_display}
                  </span>
                  <span className="text-eco-ink/50 text-sm font-body">
                    Độ tin cậy: {Math.round(d.confidence * 100)}%
                  </span>
                </div>

                {info && (
                  <div className="grid md:grid-cols-2 gap-4 font-body text-sm">
                    <div>
                      <p className="font-semibold text-eco-primary mb-1">Cách xử lý</p>
                      <p className="text-eco-ink/70">{info.process}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-eco-primary mb-1">Nên làm</p>
                      <ul className="list-disc list-inside text-eco-ink/70 space-y-0.5">
                        {info.should.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-semibold text-eco-accent mb-1">Không nên</p>
                      <ul className="list-disc list-inside text-eco-ink/70 space-y-0.5">
                        {info.avoid.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-eco-primary hover:bg-eco-primary-dark text-white font-semibold py-3.5 rounded-full transition"
      >
        Hoàn tất
      </button>
    </div>
  );
}

export default ResultCard;