import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const SpinnerTransctionIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none" className={className}>
    <g filter="url(#filter0_d_8307_17842)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 40C35.5228 40 40 35.5228 40 30C40 24.4772 35.5228 20 30 20C24.4772 20 20 24.4772 20 30C20 35.5228 24.4772 40 30 40ZM30 44C37.732 44 44 37.732 44 30C44 22.268 37.732 16 30 16C22.268 16 16 22.268 16 30C16 37.732 22.268 44 30 44Z"
        fill="white"
        fillOpacity="0.1"
      />
      <path
        d="M40 30C40 24.4772 35.5228 20 30 20L30 16C37.732 16 44 22.268 44 30C44 31.1046 43.1046 32 42 32C40.8954 32 40 31.1046 40 30Z"
        fill="url(#paint0_linear_8307_17842)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_8307_17842"
        x="0"
        y="0"
        width="60"
        height="60"
        filterUnits="userSpaceOnUse"
        colorInterpolation-filters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_8307_17842" />
        <feOffset />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8307_17842" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8307_17842" result="shape" />
      </filter>
      <linearGradient id="paint0_linear_8307_17842" x1="28" y1="20.5" x2="38" y2="35.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F63190" stopOpacity="0" />
        <stop offset="0.29603" stopColor="#F63190" />
        <stop offset="0.653056" stopColor="#9A47CF" />
        <stop offset="1" stopColor="#95CEE7" />
      </linearGradient>
    </defs>
  </svg>
)
export default SpinnerTransctionIcon
