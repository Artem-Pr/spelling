/* eslint @typescript-eslint/ban-ts-comment: 0 */
import React from 'react'

const requireAll = (requireContext: any) => requireContext.keys().map((element: any) => requireContext(element))
// @ts-ignore
const req = require.context('../../assets/images/svg-icons-html', false, /\.svg$/)
requireAll(req)

interface IProps {
  iconName?: string
  className?: string
}

const SvgIcon = ({ iconName, className }: IProps) => {
  const svgClass = className ? `icon-default ${className}` : 'icon-default'
  const icon = iconName ? `icon-${iconName}` : ''
  const name = iconName ? `#icon-${iconName}` : ''

  return (
    <svg className={svgClass} aria-hidden="true">
      <use className={`icon-use ${icon}`} xlinkHref={name} href={name}>
        {' '}
      </use>
    </svg>
  )
}

export default SvgIcon
