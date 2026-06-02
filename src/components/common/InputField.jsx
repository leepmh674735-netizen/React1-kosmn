import React from 'react';

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
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

  const inputWrapperStyle = {
    position: 'relative',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: icon ? '12px 16px 12px 38px' : '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: error ? '1.5px solid var(--accent-rust)' : '1px solid var(--gray-300)',
    backgroundColor: disabled ? 'var(--gray-100)' : 'var(--bg-milk)',
    color: 'var(--bg-coffee)',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition-fast)',
    cursor: disabled ? 'not-allowed' : 'text'
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: error ? 'var(--accent-rust)' : 'var(--gray-400)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none'
  };

  const errorStyle = {
    color: 'var(--accent-rust)',
    fontSize: '12px',
    marginTop: '2px'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {icon && <div style={iconStyle}>{icon}</div>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={inputStyle}
          className="custom-input-field"
        />
      </div>
      {error && <span style={errorStyle}>{error}</span>}
      
      <style>{`
        .custom-input-field:focus {
          border-color: var(--primary-gold) !important;
          box-shadow: 0 0 0 3px rgba(217, 160, 91, 0.15);
        }
      `}</style>
    </div>
  );
}

export default InputField;
