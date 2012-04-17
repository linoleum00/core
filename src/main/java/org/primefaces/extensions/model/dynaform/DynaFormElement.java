/*
 * Copyright 2011-2012 PrimeFaces Extensions.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * $Id$
 */

package org.primefaces.extensions.model.dynaform;

/**
 * Model interface for any element inside of <code>DynaForm</code>.
 *
 * @author  Oleg Varaksin / last modified by $Author$
 * @version $Revision$
 * @since   0.5
 */
public interface DynaFormElement {

	Object getData();

	void setData(Object data);

	String getType();

	void setType(String type);

	String getLabel();

	void setLabel(String label);

	boolean isRequired();

	void setRequired(boolean required);

	int getColspan();

	void setColspan(int colspan);

	int getRow();

	void setRow(int row);

	int getColumn();

	void setColumn(int column);
}
