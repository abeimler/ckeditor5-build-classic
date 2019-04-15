import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

/**
 *
 * @implements module:engine/dataprocessor/dataprocessor~DataProcessor
 */
export default class SimpleBBCodeDataProcessor {
	constructor() {
		/**
		 * HTML data processor used to process HTML produced by the Markdown-to-HTML converter and the other way.
		 *
		 * @private
		 * @member {module:engine/dataprocessor/htmldataprocessor~HtmlDataProcessor}
		 */
		this._htmlDP = new HtmlDataProcessor();
	}

	/**
	 * Converts the provided Markdown string to view tree.
	 *
	 * @param {String} data A Markdown string.
	 * @returns {module:engine/view/documentfragment~DocumentFragment} The converted view element.
	 */
	toView( data ) {
		const html = this._BBCodeToHtml( data );

		return this._htmlDP.toView( html );
	}

	/**
	 * Converts the provided {@link module:engine/view/documentfragment~DocumentFragment} to data format &mdash; in this
	 * case to a Markdown string.
	 *
	 * @param {module:engine/view/documentfragment~DocumentFragment} viewFragment
	 * @returns {String} Markdown string.
	 */
	toData( viewFragment ) {
		const html = this._htmlDP.toData( viewFragment );

		return this._HTMLToBBCode( html );
	}

	// / https://gist.github.com/niccolomineo/0bc0f45e86520fd508609a49e91a6251

	get BBCodeRegExMap() {
		return {
			'tagClass': {
				'(\\[[^\\]]+?)(\\§\\s*)(.+?)([\\§\\|\\#].+?)?(\\])': '$1 class=\'$3\'$4$5'
			},
			'tagId': {
				'(\\[[^\\]]+?)(\\#\\s*)(.+?)([\\§\\|\\#].+?)?(\\])': '$1 id=\'$3\'$4$5'
			},
			'tagImgAlt': {
				'(\\[img.+?)(\\|)(\\s*)(.+?)(\\s*\\w+\\=\\\'.+?)?(\\s*)([\\§\\|\\#].+?)?(\\])': '$1$3 alt=\'$4\'$5$6$7$8'
			},
			'tagATitle': {
				'(\\[a.+?)(\\|)(\\s*)(.+?)(\\s*\\w+\\=\\\'.+?)?(\\s*)([\\§\\|\\#].+?)?(\\])': '$1$3 title=\'$4\'$5$6$7$8$4</a>'
			},
			'tagImgSrc': {
				'(\\[img\\s*)(.+?)(\\s*\\w+\\=\\\'.+?)?(\\s*)([\\s\\§\\|\\#].+?)?(\\])': '$1src=\'$2\'$3$4$5$6'
			},
			'tagAHref': {
				'(\\[a\\s*)(.+?)(\\s*\\w+\\=\\\'.+?)?(\\s*)([\\s\\§\\|\\#].+?)?(\\])': '$1href=\'$2\' target=\'_blank\'$3$4$5$6'
			},
			'tagUl': {
				'(\\[\\*\\])(.*)(\\[\\/\\*\\])': '<ul><li>$2</li></ul>'
			},
			'tagLi': {
				'(\\[\\/\\*\\])(\\s*)(\\[\\*\\])': '</li><li>'
			},
			'tagFieldsetLegend': {
				'(\\[g\\s*)(.+?)(\\s*\\w+\\=\\\'.+?)?(\\s*)([\\§\\|\\#].+?)?(\\])(.+?)(\\[\\/g\\])': '<fieldset$4$5><legend class=\'sans-serif-400-italic\'>$2</legend>$7</fieldset>'
			},
			'tagSmall': {
				'(\\[)(s)(\\s*)(.*?)(\\])(.+?)(\\[)(\\/)(s)(\\])': '<small $4>$6</small>'
			},
			'tagEm': {
				'(\\[)(i)(\\s*)(.*?)(\\])(.+?)(\\[)(\\/)(i)(\\])': '<em $4>$6</em>'
			},
			'tagDiv': {
				'(\\[)(section)(\\s*)(.*?)(\\])(.+?)(\\[)(\\/)(section)(\\])': '<div $4>$6</div>'
			},
			'tagQuote': {
				'(\\[)(q)(\\s*)(.*?)(\\])(.+?)(\\[)(\\/)(q)(\\])': '<p class=\'quote\'$4><span class=\'serif-900\'>“</span> $6</p>'
			},
			'tagQuoteSource': {
				'(\\[qs\\s*)(.+?)(\\s*\\w+\\=\\\'.+?)?(\\s*)([\\s\\§\\|\\#].+?)?(\\])(.+?)(\\[)(\\/)(qs)(\\])': '<br><a href=\'$2\' class=\'quote-source\'$5>$7</a>'
			},
			'tagLanguage': {
				'(\\[)(lang)(\\s*.*?)(\\])(.+?)(\\[)(\\/)(lang)(\\])': '<p class=\'sans-serif-600\'>$5</p>'
			},
			'tagYear': {
				'(\\[)(y)(\\s*.*?)(\\])(.+?)(\\[)(\\/)(y)(\\])': '<div class=\'lang-$5-years\' id=\'skills-bar\'><p class=\'sans-serif-600\'>$5</p></div>'
			},
			'tagAngleBrackets': {
				'\\[(\\/?)(.+?)[\\]]\\]?': '<$1$2>'
			},
			'tagNewline': {
				'(?:\r\n|\r|\n)': '<br/>'
			}
		};
	}

	_BBCodeToHtml( input ) {
		for ( const i in this.BBCodeRegExMap ) {
			const BBCodeKey = Object.keys( this.BBCodeRegExMap[ i ] )[ 0 ];
			const BBCodeVal = this.BBCodeRegExMap[ i ][ BBCodeKey ];
			input.match( BBCodeKey ) ? input = input.replace( new RegExp( BBCodeKey, 'g' ), BBCodeVal ) : input;
		}
		return input;
	}

	// / https://gist.github.com/soyuka/6183947
	// Adapted from http://skeena.net/htmltobb/

	_HTMLToBBCode( html ) {
		html = html.replace( /<pre(.*?)>(.*?)<\/pre>/gmi, '[code]$2[/code]' );

		html = html.replace( /<h[1-7](.*?)>(.*?)<\/h[1-7]>/, '\n[h]$2[/h]\n' );

		// paragraph handling:
		// - if a paragraph opens on the same line as another one closes, insert an extra blank line
		// - opening tag becomes two line breaks
		// - closing tags are just removed
		// html += html.replace(/<\/p><p/<\/p>\n<p/gi;
		// html += html.replace(/<p[^>]*>/\n\n/gi;
		// html += html.replace(/<\/p>//gi;
		html = html.replace( /<p(.*?)>(.*?)<\/p>/gmi, '$2\n\n' );

		html = html.replace( /<br(.*?)>/gi, '\n' );
		html = html.replace( /<textarea(.*?)>(.*?)<\/textarea>/gmi, '\[code]$2\[\/code]' );
		html = html.replace( /<b>/gi, '[b]' );
		html = html.replace( /<i>/gi, '[i]' );
		html = html.replace( /<u>/gi, '[u]' );
		html = html.replace( /<\/b>/gi, '[/b]' );
		html = html.replace( /<\/i>/gi, '[/i]' );
		html = html.replace( /<\/u>/gi, '[/u]' );
		html = html.replace( /<em>/gi, '[b]' );
		html = html.replace( /<\/em>/gi, '[/b]' );
		html = html.replace( /<strong>/gi, '[b]' );
		html = html.replace( /<\/strong>/gi, '[/b]' );
		html = html.replace( /<cite>/gi, '[i]' );
		html = html.replace( /<\/cite>/gi, '[/i]' );
		html = html.replace( /<font color="(.*?)">(.*?)<\/font>/gmi, '[color=$1]$2[/color]' );
		html = html.replace( /<font color=(.*?)>(.*?)<\/font>/gmi, '[color=$1]$2[/color]' );
		html = html.replace( /<link(.*?)>/gi, '' );
		html = html.replace( /<li(.*?)>(.*?)<\/li>/gi, '[*]$2' );
		html = html.replace( /<ul(.*?)>/gi, '[list]' );
		html = html.replace( /<\/ul>/gi, '[/list]' );
		html = html.replace( /<div>/gi, '\n' );
		html = html.replace( /<\/div>/gi, '\n' );
		html = html.replace( /<td(.*?)>/gi, ' ' );
		html = html.replace( /&nbsp;/gi, ' ' );
		html = html.replace( /<tr(.*?)>/gi, '\n' );

		html = html.replace( /<img(.*?)src="(.*?)"(.*?)>/gi, '[img]$2[/img]' );
		html = html.replace( /<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, '[url=$2]$4[/url]' );

		html = html.replace( /<head>(.*?)<\/head>/gmi, '' );
		html = html.replace( /<object>(.*?)<\/object>/gmi, '' );
		html = html.replace( /<script(.*?)>(.*?)<\/script>/gmi, '' );
		html = html.replace( /<style(.*?)>(.*?)<\/style>/gmi, '' );
		html = html.replace( /<title>(.*?)<\/title>/gmi, '' );
		html = html.replace( /<!--(.*?)-->/gmi, '\n' );

		html = html.replace( /\/\//gi, '/' );
		html = html.replace( /http:\//gi, 'http://' );

		html = html.replace( /<(?:[^>'"]*|(['"]).*?\1)*>/gmi, '' );
		html = html.replace( /\r\r/gi, '' );
		html = html.replace( /\[img]\//gi, '[img]' );
		html = html.replace( /\[url=\//gi, '[url=' );

		html = html.replace( /(\S)\n/gi, '$1 ' );

		return html;
	}
}
