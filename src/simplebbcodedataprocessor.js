import html5Preset from '@bbob/preset-html5/es';
import { render } from '@bbob/html/es';
import bbob from '@bbob/core';

import customPreset from './custompreset';

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

	_BBCodeToHtml( input ) {
		return bbob( customPreset() ).process( input, { render } ).html;
	}

	/// https://gist.github.com/soyuka/6183947
	// Adapted from http://skeena.net/htmltobb/

	_HTMLToBBCode( html ) {
		html = html.replace( /<pre(.*?)>(.*?)<\/pre>/gmi, '[code]$2[/code]' );

		// html = html.replace( /<h[1-7](.*?)>(.*?)<\/h[1-7]>/, '\n[h]$2[/h]\n' );

		// paragraph handling:
		// - if a paragraph opens on the same line as another one closes, insert an extra blank line
		// - opening tag becomes two line breaks
		// - closing tags are just removed
		// html += html.replace(/<\/p><p/<\/p>\n<p/gi;
		// html += html.replace(/<p[^>]*>/\n\n/gi;
		// html += html.replace(/<\/p>//gi;

		html = html.replace( /<br(.*?)>/gi, '\n' );
		html = html.replace( /<textarea(.*?)>(.*?)<\/textarea>/gmi, '\[code]$2\[\/code]' );
		html = html.replace( /<code(.*?)>(.*?)<\/code>/gmi, '\[code]$2\[\/code]' );
		html = html.replace( /<b>/gi, '[b]' );
		html = html.replace( /<i>/gi, '[i]' );
		html = html.replace( /<u>/gi, '[u]' );
		html = html.replace( /<s>/gi, '[s]' );
		html = html.replace( /<\/b>/gi, '[/b]' );
		html = html.replace( /<\/i>/gi, '[/i]' );
		html = html.replace( /<\/u>/gi, '[/u]' );
		html = html.replace( /<\/s>/gi, '[/s]' );
		html = html.replace( /<em>/gi, '[b]' );
		html = html.replace( /<\/em>/gi, '[/b]' );
		html = html.replace( /<strong>/gi, '[b]' );
		html = html.replace( /<\/strong>/gi, '[/b]' );

		html = html.replace( /<sup>/gi, '[sup]' );
		html = html.replace( /<sub>/gi, '[sub]' );
		html = html.replace( /<\/sup>/gi, '[/sup]' );
		html = html.replace( /<\/sub>/gi, '[/sub]' );

		html = html.replace( /<h1(.*?)>/gi, '[h1]' );
		html = html.replace( /<h2(.*?)>/gi, '[h2]' );
		html = html.replace( /<h3(.*?)>/gi, '[h3]' );
		html = html.replace( /<h4(.*?)>/gi, '[h4]' );
		html = html.replace( /<h5(.*?)>/gi, '[h5]' );
		html = html.replace( /<\/h1>/gi, '[/h1]' );
		html = html.replace( /<\/h2>/gi, '[/h2]' );
		html = html.replace( /<\/h3>/gi, '[/h3]' );
		html = html.replace( /<\/h4>/gi, '[/h4]' );
		html = html.replace( /<\/h5>/gi, '[/h5]' );

		html = html.replace( /<blockquote>/gi, '[quote]' );
		html = html.replace( /<\/blockquote>/gi, '[/quote]' );
		html = html.replace( /<cite>/gi, '[i]' );
		html = html.replace( /<\/cite>/gi, '[/i]' );
		html = html.replace( /<font color=["'](.*?)["']>(.*?)<\/font>/gmi, '[color=$1]$2[/color]' );
		html = html.replace( /<font color=(.*?)>(.*?)<\/font>/gmi, '[color=$1]$2[/color]' );
		html = html.replace( /<font (.*?)style=["']color: (.*?);["'](.*?)>(.*?)<\/font>/gmi, '[color=$2]$4[/color]' );
		html = html.replace( /<span (.*?)style=["']color: (.*?);["'](.*?)>(.*?)<\/span>/gmi, '[color=$2]$4[/color]' );
		html = html.replace( /<font (.*?)style=["']color:(.*?);["'](.*?)>(.*?)<\/font>/gmi, '[color=$2]$4[/color]' );
		html = html.replace( /<span (.*?)style=["']color:(.*?);["'](.*?)>(.*?)<\/span>/gmi, '[color=$2]$4[/color]' );
		html = html.replace( /<link(.*?)>/gi, '' );
		html = html.replace( /<li(.*?)>(.*?)<\/li>/gi, '[*]$2' );
		html = html.replace( /<ul(.*?)>/gi, '[list]' );
		html = html.replace( /<\/ul>/gi, '[/list]' );

		html = html.replace( /<p (.*?)style=["']text-align:left;["'](.*?)>(.*?)<\/p>/gmi, '[left]$3[/left]' );
		html = html.replace( /<p (.*?)style=["']text-align:center;["'](.*?)>(.*?)<\/p>/gmi, '[center]$3[/center]' );
		html = html.replace( /<p (.*?)style=["']text-align:right;["'](.*?)>(.*?)<\/p>/gmi, '[right]$3[/right]' );
		html = html.replace( /<p (.*?)style=["']text-align:(.*?);["'](.*?)>(.*?)<\/p>/gmi, '$4' );
		html = html.replace( /<div class=["'](.*?)bbcode_left["'](.*?)>(.*?)<\/div>/gi, '[left]$3[/left]' );
		html = html.replace( /<div class=["'](.*?)bbcode_center["'](.*?)>(.*?)<\/div>/gi, '[center]$3[/center]' );
		html = html.replace( /<div class=["'](.*?)bbcode_right["'](.*?)>(.*?)<\/div>/gi, '[right]$3[/right]' );

		html = html.replace( /<div class=["'](.*?)bbcode_spoiler["'](.*?)>(.*?)<\/div>/gi, '[spoiler]$3[/spoiler]' );
		html = html.replace( /<div class=["'](.*?)bbcode_quote["'](.*?)>(<span (.*?)class=["'](.*?)bbcode_quote_name["'](.*?)>(.*?)<\/span>)?(.*?)<\/div>/gi, '[quote name=$7]$8[/quote]' );
		html = html.replace( /<div class=["'](.*?)bbcode_quote["'](.*?)>(.*?)<\/div>/gi, '[quote]$3[/quote]' );

		html = html.replace( /<div>/gi, '\n' );
		html = html.replace( /<\/div>/gi, '\n' );
		html = html.replace( /<p(.*?)>(.*?)<\/p>/gmi, '$2\n\n' );

		html = html.replace( /<td(.*?)>/gi, ' ' );
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
		html = html.replace( /\[yt=\//gi, '[yt=' );

		html = html.replace( /\[spoiler]\//gi, '[spoiler]' );
		html = html.replace( /<\/spoiler>/gi, '[/spoiler]' );

		html = html.replace( /<p(.*?)>(.*?)<\/p>/gmi, '$2\n\n' );
		html = html.replace( /&nbsp;/gi, ' ' );

		html = html.replace( /(\S)\n/gi, '$1 ' );

		return html;
	}
}
