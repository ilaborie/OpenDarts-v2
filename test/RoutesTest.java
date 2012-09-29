/*
   Copyright 2012 Igor Laborie

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
import org.junit.Test;
import play.mvc.Result;

import static play.test.Helpers.*;
import static org.fest.assertions.Assertions.*;

public class RoutesTest {

    @Test
    public void testNotices() {
        Result result = routeAndCall(fakeRequest(GET, "/notices"));
        assertThat(result).isNotNull();
    }
    
    @Test
    public void testDialog() {
        Result result = routeAndCall(fakeRequest(GET, "/dialog"));
        assertThat(result).isNotNull();
    }


}