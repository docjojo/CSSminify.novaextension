// CSSminify Extension for Nova
// Copyright © 2023 atec-systems. All rights reserved.

const CssMinService = require('./NovaCSSMinifyService');

exports.activate = function() {
	const CssMin = new CssMinService();
	nova.workspace.onDidAddTextEditor(editor => { return editor.onWillSave(CssMin.minifyCssFileOnSave.bind(CssMin)); });
	nova.commands.register('CCSminify.minifyFile', CssMin.minifyCssFileOnCommand.bind(CssMin));
};
