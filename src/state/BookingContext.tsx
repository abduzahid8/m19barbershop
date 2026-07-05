import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Service, Barber } from '../data';

interface BookingState {
  selectedServices: Service[];
  selectedBarber: Barber | null;
  preselectedBarber: Barber | null;
  selectedDate: string | null;
  selectedTime: string | null;
  currentStep: number;
}

type BookingAction =
  | { type: 'SELECT_SERVICE'; service: Service }
  | { type: 'DESELECT_SERVICE'; serviceId: string }
  | { type: 'SELECT_BARBER'; barber: Barber | null }
  | { type: 'PRESELECT_BARBER'; barber: Barber }
  | { type: 'SELECT_DATE'; date: string }
  | { type: 'SELECT_TIME'; time: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

const initialState: BookingState = {
  selectedServices: [],
  selectedBarber: null,
  preselectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  currentStep: 1,
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
      return { ...state, selectedBarber: action.barber };
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
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const selectService = useCallback(
    (service: Service) => dispatch({ type: 'SELECT_SERVICE', service }),
    []
  );
  const selectBarber = useCallback(
    (barber: Barber | null) => dispatch({ type: 'SELECT_BARBER', barber }),
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

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        selectService,
        selectBarber,
        selectDate,
        selectTime,
        nextStep,
        prevStep,
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
