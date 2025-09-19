import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { updateHoldings } from '../store/slices/portfolioSlice';
import { Button } from './ui/button';

interface EditableCellProps {
  tokenId: string;
  value: number;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({ tokenId, value, isEditing = false, onSave, onCancel }) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSave = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      dispatch(updateHoldings({ id: tokenId, holdings: numValue }));
    } else {
      setInputValue(value.toString());
    }
    if (onSave) onSave();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      if (onCancel) onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-transparent border-b border-zinc-600 focus:border-zinc-400 outline-none text-zinc-100 p-2 w-28"
          autoFocus
          step="0.0001"
          min="0"
        />
        <Button
          variant="ghost"
          className="h-7 px-2 py-1 font-light bg-[#a9e851] shadow-[0px_0px_0px_1px_#1f6619,0px_1px_2px_#1f661966,inset_0px_0.75px_0px_#ffffff33] rounded-md cursor-pointer"
          onClick={handleSave}
        >
         Save
        </Button>
        {/* {onCancel && (
          <Button
            variant="ghost"
            className="h-7 px-2 py-1 bg-[#ffffff0a] rounded-md text-zinc-100 cursor-pointer"
            onClick={() => {
              setInputValue(value.toString());
              onCancel();
            }}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        )} */}
      </div>
    );
  }

  return (
    <div className="px-1 py-0.5 rounded transition-colors text-zinc-100 ">
      {value.toFixed(4)}
    </div>
  );
};