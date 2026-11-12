/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinzenData, Meta, Prestamo, Transaction } from './types/financial';
import { getInitialData } from './utils/demoData';
import { calcularInfo } from './utils/calculations';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { GoalsLoansView } from './views/GoalsLoansView';
import { AnalyticsSettingsView } from './views/AnalyticsSettingsView';
import { TransactionModal } from './components/TransactionModal';
import { GoalModal } from './components/GoalModal';
import { LoanModal } from './components/LoanModal';
import { BackupModal } from './components/BackupModal';

const STORAGE_KEY = 'finzenDataPro';

export default function App() {
  // Load data from localStorage or demo data
  const [data, setData] = useState<FinzenData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.transacciones)) {
          return {
            userName: parsed.userName || 'David',
            moneda: parsed.moneda || 'COP',
            ahorroPct: typeof parsed.ahorroPct === 'number' ? parsed.ahorroPct : 10,
            nextId: parsed.nextId || (parsed.transacciones.length + 1),
            nextIdPrestamo: parsed.nextIdPrestamo || ((parsed.prestamos?.length || 0) + 1),
            transacciones: parsed.transacciones,
            metas: parsed.metas || [],
            prestamos: parsed.prestamos || [],
          };
        }
      }
    } catch (e) {
      console.error('Error parsing localStorage data', e);
    }
    const initial = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  });

  const [currentTab, setCurrentTab] = useState<string>('inicio');

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Active items for deposit/payment modals
  const [activeGoalDeposit, setActiveGoalDeposit] = useState<{ goal: Meta; index: number } | null>(null);
  const [activeLoanPayment, setActiveLoanPayment] = useState<Prestamo | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Sync state changes with localStorage
  const updateDataAndStore = (newData: FinzenData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  // Dynamic Financial Summary Calculation
  const summary = calcularInfo(data);

  // Actions: Transactions
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      id: data.nextId,
      ...newTxData,
    };
    const updated: FinzenData = {
      ...data,
      nextId: data.nextId + 1,
      transacciones: [newTx, ...data.transacciones],
    };
    updateDataAndStore(updated);
    showToast(newTx.tipo === 'gasto' ? 'Gasto registrado' : 'Ingreso registrado');
  };

  const handleDeleteTransaction = (id: number) => {
    const updated: FinzenData = {
      ...data,
      transacciones: data.transacciones.filter((t) => t.id !== id),
    };
    updateDataAndStore(updated);
    showToast('Movimiento eliminado');
  };

  // Actions: Goals
  const handleAddGoal = (goalData: Omit<Meta, 'id'>) => {
    const newGoal: Meta = {
      id: Date.now(),
      ...goalData,
    };
    const updated: FinzenData = {
      ...data,
      metas: [...data.metas, newGoal],
    };
    updateDataAndStore(updated);
    showToast('Meta de ahorro creada');
  };

  const handleDepositGoal = (index: number, amount: number) => {
    const updatedMetas = [...data.metas];
    const targetGoal = updatedMetas[index];
    if (!targetGoal) return;

    targetGoal.ahorrado = Math.min(targetGoal.ahorrado + amount, targetGoal.objetivo);
    const updated: FinzenData = {
      ...data,
      metas: updatedMetas,
    };
    updateDataAndStore(updated);
    showToast(`Abono a "${targetGoal.nombre}" completado`);
  };

  const handleDeleteGoal = (index: number) => {
    const updatedMetas = data.metas.filter((_, idx) => idx !== index);
    const updated: FinzenData = {
      ...data,
      metas: updatedMetas,
    };
    updateDataAndStore(updated);
    showToast('Meta eliminada');
  };

  // Actions: Loans
  const handleAddLoan = (loanData: Omit<Prestamo, 'id'>) => {
    const newLoan: Prestamo = {
      id: data.nextIdPrestamo,
      ...loanData,
    };
    const updated: FinzenData = {
      ...data,
      nextIdPrestamo: data.nextIdPrestamo + 1,
      prestamos: [...data.prestamos, newLoan],
    };
    updateDataAndStore(updated);
    showToast('Registro de préstamo guardado');
  };

  const handlePaymentLoan = (loanId: number, amount: number) => {
    const updatedLoans = data.prestamos.map((p) => {
      if (p.id === loanId) {
        return {
          ...p,
          pagado: Math.min(p.pagado + amount, p.monto),
        };
      }
      return p;
    });
    const updated: FinzenData = {
      ...data,
      prestamos: updatedLoans,
    };
    updateDataAndStore(updated);
    showToast('Abono registrado');
  };

  const handleDeleteLoan = (loanId: number) => {
    const updated: FinzenData = {
      ...data,
      prestamos: data.prestamos.filter((p) => p.id !== loanId),
    };
    updateDataAndStore(updated);
    showToast('Préstamo eliminado');
  };

  // Actions: Settings
  const handleUpdateSettings = (newAhorroPct: number, newMoneda: string, newUserName: string) => {
    const updated: FinzenData = {
      ...data,
      ahorroPct: newAhorroPct,
      moneda: newMoneda,
      userName: newUserName,
    };
    updateDataAndStore(updated);
  };

  // Actions: Backup & Demo
  const handleRestoreData = (restoredData: FinzenData) => {
    updateDataAndStore(restoredData);
    showToast('¡Datos restaurados con éxito!');
  };

  const handleResetAll = () => {
    const emptyData: FinzenData = {
      transacciones: [],
      metas: [],
      prestamos: [],
      nextId: 1,
      nextIdPrestamo: 1,
      ahorroPct: 10,
      userName: 'David',
      moneda: 'COP',
    };
    updateDataAndStore(emptyData);
    showToast('Datos restablecidos');
  };

  const handleLoadDemo = () => {
    const demo = getInitialData();
    updateDataAndStore(demo);
    showToast('Datos de demostración cargados');
  };

  const handleForzarActualizacion = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.update();
        }
      });
    }
    showToast('Actualizando datos de la aplicación...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-indigo-500/40 shadow-xl shadow-indigo-950/50 flex items-center gap-2 animate-fade-in backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewTransaction={() => setIsTxModalOpen(true)}
        userName={data.userName}
        zenScore={summary.zenScore}
      />

      {/* App Body Container: Desktop Sidebar + Viewport */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenNewTransaction={() => setIsTxModalOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
          summary={summary}
          userName={data.userName}
          currency={data.moneda}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto w-full">
          {currentTab === 'inicio' && (
            <DashboardView
              data={data}
              summary={summary}
              onOpenNewTransaction={() => setIsTxModalOpen(true)}
              onOpenDeposit={(goal, idx) => {
                setActiveGoalDeposit({ goal, index: idx });
                setIsGoalModalOpen(true);
              }}
              onOpenLoanPayment={(loan) => {
                setActiveLoanPayment(loan);
                setIsLoanModalOpen(true);
              }}
              onNavigateTab={setCurrentTab}
              onOpenGoalModal={() => {
                setActiveGoalDeposit(null);
                setIsGoalModalOpen(true);
              }}
            />
          )}

          {currentTab === 'movimientos' && (
            <TransactionsView
              transactions={data.transacciones}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenNewTransaction={() => setIsTxModalOpen(true)}
              currency={data.moneda}
            />
          )}

          {currentTab === 'metas' && (
            <GoalsLoansView
              metas={data.metas}
              prestamos={data.prestamos}
              onOpenNewGoal={() => {
                setActiveGoalDeposit(null);
                setIsGoalModalOpen(true);
              }}
              onOpenDeposit={(goal, idx) => {
                setActiveGoalDeposit({ goal, index: idx });
                setIsGoalModalOpen(true);
              }}
              onDeleteGoal={handleDeleteGoal}
              onOpenNewLoan={() => {
                setActiveLoanPayment(null);
                setIsLoanModalOpen(true);
              }}
              onOpenLoanPayment={(loan) => {
                setActiveLoanPayment(loan);
                setIsLoanModalOpen(true);
              }}
              onDeleteLoan={handleDeleteLoan}
              currency={data.moneda}
            />
          )}

          {currentTab === 'ajustes' && (
            <AnalyticsSettingsView
              data={data}
              summary={summary}
              onUpdateSettings={handleUpdateSettings}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onForzarActualizacion={handleForzarActualizacion}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewTransaction={() => setIsTxModalOpen(true)}
      />

      {/* MODALS */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleAddTransaction}
        currency={data.moneda}
        limiteDiario={summary.limiteDiario}
        gasHoy={summary.gasHoy}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setActiveGoalDeposit(null);
        }}
        onSaveNewGoal={handleAddGoal}
        onDeposit={handleDepositGoal}
        activeGoalForDeposit={activeGoalDeposit}
        currency={data.moneda}
      />

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => {
          setIsLoanModalOpen(false);
          setActiveLoanPayment(null);
        }}
        onSaveNewLoan={handleAddLoan}
        onPayment={handlePaymentLoan}
        activeLoanForPayment={activeLoanPayment}
        currency={data.moneda}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        data={data}
        onRestoreData={handleRestoreData}
        onResetAll={handleResetAll}
        onLoadDemo={handleLoadDemo}
      />
    </div>
  );
}
