import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	env: {
		// Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
		SC_DISABLE_SPEEDY: 'false'
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			use: ['@svgr/webpack']
		})
		config.externals = [
			...(config.externals || []),
			{
				sharp: 'commonjs sharp'
			}
		]
		return config
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js'
			}
		}
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io'
			}
		],
		qualities: [75, 100]
	}
}

export default nextConfig
