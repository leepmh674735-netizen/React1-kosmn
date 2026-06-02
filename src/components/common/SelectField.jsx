import React from 'react';

function SelectField({
  label,
  value,
  onChange,
  error,
  options = [], // [{ value, label }] or string array
  name,
  disabled = false,
  style = {}
}) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    ...style
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--bg-coffee)'
  };

  const selectStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    border: error ? '1.5px solid var(--accent-rust)' : '1px solid var(--gray-300)',
    backgroundColor: 'var(--bg-milk)',
    color: 'var(--bg-coffee)',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition-fast)',
    cursor: 'pointer'
  };

  const errorStyle = {
    color: 'var(--accent-rust)',
    fontSize: '12px',
    marginTop: '2px'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ ...selectStyle, backgroundColor: disabled ? 'var(--gray-100)' : 'var(--bg-milk)', cursor: disabled ? 'not-allowed' : 'pointer' }}
        className="custom-select-field"
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <span style={errorStyle}>{error}</span>}

      <style>{`
        .custom-select-field:focus {
          border-color: var(--primary-gold) !important;
          box-shadow: 0 0 0 3px rgba(217, 160, 91, 0.15);
        }
      `}</style>
    </div>
  );
}

export default SelectField;
