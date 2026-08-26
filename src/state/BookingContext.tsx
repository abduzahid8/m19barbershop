import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Service, Barber } from '../data';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

interface BookingState {
  selectedServices: Service[];
  selectedBarber: Barber | null;
  anyBarber: boolean;
  preselectedBarber: Barber | null;
  selectedDate: string | null;
  selectedTime: string | null;
  currentStep: number;
  submitting: boolean;
  submitError: string | null;
}

type BookingAction =
  | { type: 'SELECT_SERVICE'; service: Service }
  | { type: 'DESELECT_SERVICE'; serviceId: string }
  | { type: 'SELECT_BARBER'; barber: Barber | null }
  | { type: 'SELECT_ANY_BARBER' }
  | { type: 'PRESELECT_BARBER'; barber: Barber }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'SELECT_TIME'; time: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_SUBMITTING'; submitting: boolean }
  | { type: 'SET_SUBMIT_ERROR'; error: string | null }
  | { type: 'RESET' };

const initialState: BookingState = {
  selectedServices: [],
  selectedBarber: null,
  anyBarber: false,
  preselectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  currentStep: 1,
  submitting: false,
  submitError: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_SERVICE': {
      const exists = state.selectedServices.find((s) => s.id === action.service.id);
      if (exists) {
        return {
          ...state,
          selectedServices: state.selectedServices.filter((s) => s.id !== action.service.id),
        };
      }
      return { ...state, selectedServices: [...state.selectedServices, action.service] };
    }
    case 'DESELECT_SERVICE':
      return {
        ...state,
        selectedServices: state.selectedServices.filter((s) => s.id !== action.serviceId),
      };
    case 'SELECT_BARBER':
      return { ...state, selectedBarber: action.barber, anyBarber: false };
    case 'SELECT_ANY_BARBER':
      return { ...state, selectedBarber: null, anyBarber: true };
    case 'PRESELECT_BARBER':
      return { ...state, preselectedBarber: action.barber, selectedBarber: action.barber };
    case 'SELECT_DATE':
      return { ...state, selectedDate: action.date, selectedTime: null };
    case 'SELECT_TIME':
      return { ...state, selectedTime: action.time };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.submitting };
    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.error };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  selectService: (service: Service) => void;
  selectBarber: (barber: Barber | null) => void;
  selectAnyBarber: () => void;
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitBooking: (params: {
    barberId: string;
    serviceIds: string[];
    datetime: string;
    duration: number;
  }) => Promise<string | null>;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { user } = useAuth();

  const selectService = useCallback(
    (service: Service) => dispatch({ type: 'SELECT_SERVICE', service }),
    []
  );
  const selectBarber = useCallback(
    (barber: Barber | null) => dispatch({ type: 'SELECT_BARBER', barber }),
    []
  );
  const selectAnyBarber = useCallback(
    () => dispatch({ type: 'SELECT_ANY_BARBER' }),
    []
  );
  const selectDate = useCallback(
    (date: string) => dispatch({ type: 'SELECT_DATE', date }),
    []
  );
  const selectTime = useCallback(
    (time: string) => dispatch({ type: 'SELECT_TIME', time }),
    []
  );
  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const submitBooking = useCallback(async (params: {
    barberId: string;
    serviceIds: string[];
    datetime: string;
    duration: number;
  }): Promise<string | null> => {
    if (!user) return 'Not authenticated';
    dispatch({ type: 'SET_SUBMITTING', submitting: true });
    dispatch({ type: 'SET_SUBMIT_ERROR', error: null });
    const result = await api.createAppointment({
      userEmail: user.email,
      userName: user.name,
      barberId: params.barberId,
      serviceIds: params.serviceIds,
      datetime: params.datetime,
      duration: params.duration,
    });
    if (result.error) {
      dispatch({ type: 'SET_SUBMIT_ERROR', error: result.error });
      dispatch({ type: 'SET_SUBMITTING', submitting: false });
      return result.error;
    }
    dispatch({ type: 'SET_SUBMITTING', submitting: false });
    return null;
  }, [user?.email, user?.name]);

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        selectService,
        selectBarber,
        selectAnyBarber,
        selectDate,
        selectTime,
        nextStep,
        prevStep,
        submitBooking,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
