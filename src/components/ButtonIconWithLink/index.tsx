import { CSSProperties } from 'react';
import './styles.css';

export interface ButtonIconWithLinkProps {
  readonly buttonText: string;
  readonly link?: string | null;
  readonly img?: string | null;
  readonly altText?: string;
  readonly border?: number;
  readonly borderType?:
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset';
  readonly borderColor?: string;
  readonly borderRadius?: number;
  readonly buttonWidth?: number;
  readonly buttonHeight?: number;
  readonly imgWidth?: number;
  readonly imgHeight?: number;
  readonly fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  readonly fontSize?: number;
  readonly fontColor?: string;
  readonly backgroundColor?: string;
  readonly boxShadowColor?: string;
  readonly boxShadowBlurRadius?: number;
  readonly boxShadowSpreadRadius?: number;
  readonly boxShadowX?: number;
  readonly boxShadowY?: number;
  readonly style?: CSSProperties;
  readonly imgStyle?: CSSProperties;
  readonly buttonTextStyle?: CSSProperties;
}

export default function ButtonIconWithLink({
  buttonText,
  altText = '',
  link = null,
  img = null,
  border = 2,
  borderType = 'solid',
  borderColor = 'black',
  borderRadius = 5,
  buttonWidth = 190,
  buttonHeight = 40,
  imgWidth = 26,
  imgHeight = 26,
  fontWeight = 700,
  fontSize = 14,
  fontColor = 'black',
  backgroundColor = 'white',
  boxShadowColor = 'black',
  boxShadowBlurRadius = 5,
  boxShadowSpreadRadius = 2,
  boxShadowX = 0,
  boxShadowY = 0,
  style = {},
  imgStyle = {},
  buttonTextStyle = {},
}: ButtonIconWithLinkProps) {
  const borderStyle =
    border != null && border > 0 ? `${border}px ${borderType} ${borderColor}` : 'none';

  return (
    <a
      className="btn-outline"
      style={{
        border: borderStyle,
        borderRadius: `${borderRadius}px`,
        width: `${buttonWidth}px`,
        height: `${buttonHeight}px`,
        background: `${backgroundColor}`,
        boxShadow: `${boxShadowColor} ${boxShadowX}px ${boxShadowY}px ${boxShadowBlurRadius}px ${boxShadowSpreadRadius}px`,
        ...style,
      }}
      href={link ?? undefined}
      {...(link && { target: '_blank', rel: 'noreferrer' })}
    >
      {img && (
        <img
          src={img}
          width={imgWidth}
          height={imgHeight}
          alt={altText ?? undefined}
          style={{ ...imgStyle }}
        />
      )}
      <span
        style={{
          fontWeight: `${fontWeight}`,
          fontSize: `${fontSize}px`,
          color: `${fontColor}`,
          ...buttonTextStyle,
        }}
      >
        {buttonText}
      </span>
    </a>
  );
}
