import React, { useState, useEffect } from 'react';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';

export default function CreditSimulator({ carPrice }) {
    const initialPrice = carPrice || 10000000;
    const [amount, setAmount] = useState(initialPrice);
    const [downPayment, setDownPayment] = useState(initialPrice * 0.3);
    const [months, setMonths] = useState(24);
    const [interestRate] = useState(48); // Tasa estimada anual

    useEffect(() => {
        if (carPrice) {
            setAmount(carPrice);
            setDownPayment(carPrice * 0.3);
        }
    }, [carPrice]);

    const loanAmount = amount - downPayment;
    const monthlyRate = (interestRate / 100) / 12;
    const monthlyPayment = loanAmount > 0
        ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
        : 0;

    const totalToPay = monthlyPayment * months;

    return (
        <div className="premium-card p-4 border-accent border-opacity-10">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="h5 fw-bold mb-0 d-flex align-items-center">
                    <FaCalculator className="text-accent me-2" />
                    Simulador Financiero
                </h3>
                <span className="badge bg-secondary bg-opacity-25 text-accent small">TNA {interestRate}%</span>
            </div>

            {/* Monto del Vehículo (FIJO) */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-10">
                    <label className="small text-light text-uppercase tracking-wider mb-0">Precio del Vehículo</label>
                    <span className="h5 fw-bold text-accent mb-0">${amount.toLocaleString()}</span>
                </div>
            </div>

            {/* Entrega Inicial */}
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <label className="small text-light text-uppercase tracking-wider">Entrega Inicial ({Math.round((downPayment / amount) * 100)}%)</label>
                    <span className="fw-bold text-light">${downPayment.toLocaleString()}</span>
                </div>
                <input
                    type="range"
                    className="form-range custom-range"
                    min={amount * 0.2}
                    max={amount * 0.9}
                    step="50000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between mt-1">
                    <span className="text-secondary" style={{ fontSize: '0.65rem' }}>Mín. 20%</span>
                    <span className="text-secondary" style={{ fontSize: '0.65rem' }}>Máx. 90%</span>
                </div>
            </div>

            {/* Plazo */}
            <div className="mb-4">
                <label className="small text-light text-uppercase tracking-wider d-block mb-3">Plazo de Financiación</label>
                <div className="btn-group w-100 shadow-sm" role="group">
                    {[12, 24, 36, 48].map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMonths(m)}
                            className={`btn btn-sm py-2 ${months === m ? 'btn-premium text-light' : 'btn-outline-light opacity-50'}`}
                        >
                            {m} meses
                        </button>
                    ))}
                </div>
            </div>

            {/* Resultado Principal */}
            <div className="p-4 rounded-4 position-relative overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid rgba(220, 53, 69, 0.2)' }}>
                <div className="text-center position-relative" style={{ zIndex: 1 }}>
                    <div className="small text-light text-uppercase tracking-widest mb-1">Cuota Mensual</div>
                    <div className="display-6 fw-bold text-accent mb-0">
                        ${Math.round(monthlyPayment).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Desglose */}
            <div className="small border-top border-secondary border-opacity-10 pt-3">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light text-uppercase opacity-75" style={{ fontSize: '0.7rem' }}>Monto a financiar:</span>
                    <span className="text-light fw-bold">${loanAmount.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <span className="text-light text-uppercase opacity-75" style={{ fontSize: '0.7rem' }}>Total estimado a pagar:</span>
                    <span className="text-light opacity-75">${Math.round(totalToPay).toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-4 p-2 bg-secondary bg-opacity-10 rounded-3 d-flex align-items-start gap-2">
                <FaInfoCircle className="text-accent mt-1 flex-shrink-0" size={14} />
                <p className="small text-light opacity-75 mb-0 fst-italic" style={{ fontSize: '0.75rem' }}>
                    Esta simulación es una estimación. El otorgamiento del crédito está sujeto a aprobación crediticia.
                </p>
            </div>
        </div>
    );
}
