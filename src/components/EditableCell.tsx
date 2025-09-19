import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { updateHoldings } from '../store/slices/portfolioSlice';

interface EditableCellProps {
  tokenId: string;
  value: number;
}

export const EditableCell: React.FC<EditableCellProps> = ({ tokenId, value }) => {
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className="w-full bg-transparent border-b border-zinc-600 focus:border-zinc-400 outline-none text-zinc-100 p-2"
        autoFocus
        step="0.0001"
        min="0"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-zinc-700 px-1 py-0.5 rounded transition-colors text-zinc-100 "
    >
      {value.toFixed(4)}
    </div>
  );
};